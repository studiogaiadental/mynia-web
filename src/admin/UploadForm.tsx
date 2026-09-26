import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { UploadCancelledError, uploadApk, type Apk, type UploadHandle } from './api'
import { formatBytes } from './format'

type UploadFormProps = {
  token: string
  onUploaded: (apk: Apk) => void
  onError: (err: unknown, fallback: string) => void
}

type Progress = { loaded: number; total: number }

// Same rule as the server: letters and digits, then also . + _ -
const VERSION_NAME_PATTERN = '[0-9A-Za-z][0-9A-Za-z.+_\\-]*'

export default function UploadForm({ token, onUploaded, onError }: UploadFormProps) {
  const uploadRef = useRef<UploadHandle | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null
    if (picked && !picked.name.toLowerCase().endsWith('.apk')) {
      event.target.value = ''
      setFile(null)
      setFileError('Choose an .apk file.')
      return
    }
    setFile(picked)
    setFileError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) return
    const form = event.currentTarget
    // file, versionName, versionCode, releaseNotes and, when ticked, activate=on
    const data = new FormData(form)

    setProgress({ loaded: 0, total: file.size })
    const upload = uploadApk(token, data, (loaded, total) => setProgress({ loaded, total }))
    uploadRef.current = upload
    try {
      const apk = await upload.promise
      form.reset()
      setFile(null)
      onUploaded(apk)
    } catch (err) {
      if (!(err instanceof UploadCancelledError)) onError(err, 'The upload failed.')
    } finally {
      uploadRef.current = null
      setProgress(null)
    }
  }

  const uploading = progress !== null
  const percent = progress && progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : 0

  return (
    <section className="admin-card" aria-labelledby="admin-upload-title">
      <h2 id="admin-upload-title" className="admin-card__title">
        Upload a new APK
      </h2>
      <form className="admin-upload" onSubmit={handleSubmit}>
        <fieldset className="admin-upload__fields" disabled={uploading}>
          <label className="admin-field admin-upload__file">
            <span className="admin-field__label">APK file</span>
            <input
              className="admin-input admin-input--file"
              type="file"
              name="file"
              accept=".apk,application/vnd.android.package-archive"
              required
              onChange={handleFileChange}
            />
            {file && <span className="admin-field__hint">{formatBytes(file.size)}</span>}
            {fileError && (
              <span className="admin-field__error" role="alert">
                {fileError}
              </span>
            )}
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Version name</span>
            <input
              className="admin-input"
              name="versionName"
              placeholder="e.g. 1.4.0"
              required
              maxLength={50}
              pattern={VERSION_NAME_PATTERN}
              title='Letters, digits, ".", "-", "_" or "+", e.g. 1.4.0'
              autoComplete="off"
            />
          </label>

          <label className="admin-field">
            <span className="admin-field__label">
              Version code <span className="admin-field__optional">(optional)</span>
            </span>
            <input
              className="admin-input"
              name="versionCode"
              type="number"
              inputMode="numeric"
              min={1}
              max={2100000000}
              step={1}
              placeholder="e.g. 14"
            />
          </label>

          <label className="admin-field admin-upload__notes">
            <span className="admin-field__label">
              Release notes <span className="admin-field__optional">(optional)</span>
            </span>
            <textarea className="admin-input admin-textarea" name="releaseNotes" rows={3} maxLength={2000} />
          </label>

          <label className="admin-checkbox admin-upload__activate">
            <input type="checkbox" name="activate" />
            <span>Make this the active download after uploading</span>
          </label>
        </fieldset>

        {progress ? (
          <div className="admin-progress">
            <progress
              className="admin-progress__bar"
              value={progress.loaded}
              max={progress.total || 1}
              aria-label="Upload progress"
            />
            <div className="admin-progress__row">
              <span className="admin-progress__text">
                {percent < 100
                  ? `Uploading… ${percent}% · ${formatBytes(progress.loaded)} of ${formatBytes(progress.total)}`
                  : 'Processing on the server…'}
              </span>
              <button
                type="button"
                className="admin-button admin-button--secondary"
                onClick={() => uploadRef.current?.abort()}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-upload__actions">
            <button className="admin-button admin-button--primary">Upload APK</button>
          </div>
        )}
      </form>
    </section>
  )
}
