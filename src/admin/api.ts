import { API_BASE_URL } from '../lib/api'
import type { AdminSession } from './session'

export type Apk = {
  id: string
  versionName: string
  versionCode: number | null
  releaseNotes: string
  originalFileName: string
  fileSize: number
  /** sha256, hex */
  checksum: string
  isActive: boolean
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

export type ApkDetails = {
  versionName: string
  versionCode: number | null
  releaseNotes: string
}

/** status 0 = the request never got an answer (offline, server down, CORS). */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export class UploadCancelledError extends Error {
  constructor() {
    super('Upload cancelled')
    this.name = 'UploadCancelledError'
  }
}

const NETWORK_ERROR = "Can't reach the server. Check your connection and try again."

async function toApiError(res: Response): Promise<ApiError> {
  let message = `Request failed (${res.status})`
  try {
    const body = (await res.json()) as { error?: unknown }
    if (typeof body.error === 'string') message = body.error
  } catch {
    // Not a JSON error body; keep the generic message.
  }
  return new ApiError(res.status, message)
}

async function request<T>(
  path: string,
  { token, method = 'GET', body }: { token?: string; method?: string; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, NETWORK_ERROR)
  }
  if (!res.ok) throw await toApiError(res)
  return (res.status === 204 ? undefined : await res.json()) as T
}

export async function login(username: string, password: string): Promise<AdminSession> {
  const res = await request<{ token: string; expiresAt: string; admin: { username: string } }>(
    '/admin/login',
    { method: 'POST', body: { username, password } },
  )
  return { token: res.token, username: res.admin.username, expiresAt: res.expiresAt }
}

export async function listApks(token: string): Promise<Apk[]> {
  return (await request<{ apks: Apk[] }>('/apks', { token })).apks
}

export async function updateApk(token: string, id: string, details: ApkDetails): Promise<Apk> {
  return (await request<{ apk: Apk }>(`/apks/${id}`, { token, method: 'PATCH', body: details })).apk
}

export async function activateApk(token: string, id: string): Promise<Apk> {
  return (await request<{ apk: Apk }>(`/apks/${id}/activate`, { token, method: 'POST' })).apk
}

export async function deleteApk(token: string, id: string): Promise<void> {
  await request<void>(`/apks/${id}`, { token, method: 'DELETE' })
}

export type OcrWarmStatus = {
  warmMode: {
    enabled: boolean
    /** Minutes with no KTP scan before it switches itself off. */
    autoOffMinutes: number
    enabledAt: string | null
    enabledBy: string | null
    disabledAt: string | null
    /** An admin username, or "auto-off" when inactivity switched it off. */
    disabledBy: string | null
    lastOcrRequestAt: string | null
    /** When it will switch itself off; null while off. */
    autoOffAt: string | null
  }
  runpod: {
    configured: boolean
    minWorkers: number | null
    /** idle, initializing, ready, running, throttled, unhealthy */
    workers: Record<string, number> | null
    error?: string
  }
}

export type OcrWarmPatch = { enabled?: boolean; autoOffMinutes?: number }

export async function getOcrWarmMode(token: string): Promise<OcrWarmStatus> {
  return request<OcrWarmStatus>('/admin/ocr-warm-mode', { token })
}

export async function updateOcrWarmMode(token: string, patch: OcrWarmPatch): Promise<OcrWarmStatus> {
  return request<OcrWarmStatus>('/admin/ocr-warm-mode', { token, method: 'PATCH', body: patch })
}

export type ApkUploadDetails = ApkDetails & { activate: boolean }

export type UploadHandle = {
  promise: Promise<Apk>
  abort: () => void
}

type UploadSession = { id: string; chunkSize: number; totalChunks: number }

// Tries per chunk before the upload gives up. Only failures a retry can fix
// are retried: a dropped connection or a server error.
const CHUNK_ATTEMPTS = 3

function isRetryable(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 0 || err.status >= 500)
}

function sendChunk(
  token: string,
  upload: UploadSession,
  index: number,
  chunk: Blob,
  onProgress: (loaded: number) => void,
  onStart: (xhr: XMLHttpRequest) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    onStart(xhr)
    xhr.open('PUT', `${API_BASE_URL}/apks/uploads/${upload.id}/chunks/${index}`)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')
    xhr.responseType = 'json'
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded)
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve()
      const body = xhr.response as { error?: string } | null
      reject(new ApiError(xhr.status, body?.error ?? `Upload failed (${xhr.status})`))
    }
    // No status at all: the connection dropped, or a proxy refused the
    // request without CORS headers -- typically a request-size limit.
    xhr.onerror = () =>
      reject(
        new ApiError(
          0,
          `Sending part ${index + 1} of ${upload.totalChunks} failed. Check your connection; if it keeps failing, a proxy in front of the API may be refusing the request size.`,
        ),
      )
    xhr.onabort = () => reject(new UploadCancelledError())
    xhr.send(chunk)
  })
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Sent in chunks rather than one request: Cloudflare in front of the API
// refuses request bodies over 100 MB, and a release APK is bigger than that.
// The server picks the chunk size. The chunks go through XMLHttpRequest
// because fetch can't report upload progress.
export function uploadApk(
  token: string,
  file: File,
  details: ApkUploadDetails,
  onProgress: (loaded: number, total: number) => void,
): UploadHandle {
  let cancelled = false
  let current: XMLHttpRequest | null = null
  let uploadId: string | null = null

  const run = async (): Promise<Apk> => {
    const { upload } = await request<{ upload: UploadSession }>('/apks/uploads', {
      token,
      method: 'POST',
      body: { fileName: file.name, fileSize: file.size, ...details },
    })
    uploadId = upload.id

    let sent = 0
    for (let index = 0; index < upload.totalChunks; index++) {
      const chunk = file.slice(index * upload.chunkSize, (index + 1) * upload.chunkSize)
      for (let attempt = 1; ; attempt++) {
        if (cancelled) throw new UploadCancelledError()
        try {
          await sendChunk(
            token,
            upload,
            index,
            chunk,
            (loaded) => onProgress(sent + loaded, file.size),
            (xhr) => {
              current = xhr
            },
          )
          break
        } catch (err) {
          if (cancelled || attempt >= CHUNK_ATTEMPTS || !isRetryable(err)) throw err
          await wait(1000 * attempt)
        }
      }
      sent += chunk.size
      onProgress(sent, file.size)
    }

    if (cancelled) throw new UploadCancelledError()
    const done = await request<{ apk: Apk }>(`/apks/uploads/${upload.id}/complete`, {
      token,
      method: 'POST',
    })
    return done.apk
  }

  const promise = run().catch((err: unknown) => {
    // Don't leave the partly uploaded file on the server. After a 401 there's
    // no session to do that with; the server sweeps it up later.
    if (uploadId && !(err instanceof ApiError && err.status === 401)) {
      void request<void>(`/apks/uploads/${uploadId}`, { token, method: 'DELETE' }).catch(
        () => undefined,
      )
    }
    throw err
  })

  return {
    promise,
    abort: () => {
      cancelled = true
      current?.abort()
    },
  }
}
