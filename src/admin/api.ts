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

export type UploadHandle = {
  promise: Promise<Apk>
  abort: () => void
}

// XMLHttpRequest rather than fetch: fetch can't report upload progress, and a
// release APK is over 100 MB.
export function uploadApk(
  token: string,
  form: FormData,
  onProgress: (loaded: number, total: number) => void,
): UploadHandle {
  const xhr = new XMLHttpRequest()
  const promise = new Promise<Apk>((resolve, reject) => {
    xhr.open('POST', `${API_BASE_URL}/apks`)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.responseType = 'json'
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded, event.total)
    }
    xhr.onload = () => {
      const body = xhr.response as { apk?: Apk; error?: string } | null
      if (xhr.status === 201 && body?.apk) resolve(body.apk)
      else reject(new ApiError(xhr.status, body?.error ?? `Upload failed (${xhr.status})`))
    }
    xhr.onerror = () => reject(new ApiError(0, NETWORK_ERROR))
    xhr.onabort = () => reject(new UploadCancelledError())
    xhr.send(form)
  })
  return { promise, abort: () => xhr.abort() }
}
