import { useState, type FormEvent } from 'react'
import type { Apk, ApkDetails } from './api'
import { formatBytes, formatDateTime } from './format'

type ApkTableProps = {
  apks: Apk[]
  /** The APK an action is running on; its buttons are disabled meanwhile. */
  busyId: string | null
  onActivate: (apk: Apk) => void
  onSave: (apk: Apk, details: ApkDetails) => Promise<boolean>
  onDelete: (apk: Apk) => void
}

const VERSION_NAME_PATTERN = '[0-9A-Za-z][0-9A-Za-z.+_\\-]*'

export default function ApkTable({ apks, busyId, onActivate, onSave, onDelete }: ApkTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  if (apks.length === 0) {
    return <p className="admin-muted">No APKs uploaded yet. Upload the first one above.</p>
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th scope="col">Version</th>
          <th scope="col">File</th>
          <th scope="col">Uploaded</th>
          <th scope="col">
            <span className="admin-visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {apks.map((apk) =>
          editingId === apk.id ? (
            <EditRow
              key={apk.id}
              apk={apk}
              busy={busyId === apk.id}
              onCancel={() => setEditingId(null)}
              onSave={async (details) => {
                if (await onSave(apk, details)) setEditingId(null)
              }}
            />
          ) : (
            <tr key={apk.id} className={apk.isActive ? 'admin-table__row--active' : undefined}>
              <td data-label="Version">
                <div className="admin-version">
                  <strong className="admin-version__name">{apk.versionName}</strong>
                  {apk.isActive && <span className="admin-badge">Active</span>}
                </div>
                {apk.versionCode !== null && <div className="admin-muted">Build {apk.versionCode}</div>}
                {apk.releaseNotes && <p className="admin-version__notes">{apk.releaseNotes}</p>}
              </td>
              <td data-label="File">
                <div className="admin-file__name">{apk.originalFileName}</div>
                <div className="admin-muted">{formatBytes(apk.fileSize)}</div>
                <div className="admin-file__checksum" title={`sha256 ${apk.checksum}`}>
                  sha256 {apk.checksum.slice(0, 12)}…
                </div>
              </td>
              <td data-label="Uploaded">
                <div>{formatDateTime(apk.createdAt)}</div>
                <div className="admin-muted">by {apk.uploadedBy}</div>
              </td>
              <td className="admin-table__actions">
                {!apk.isActive && (
                  <button
                    type="button"
                    className="admin-button admin-button--primary admin-button--small"
                    disabled={busyId !== null}
                    onClick={() => onActivate(apk)}
                  >
                    Set active
                  </button>
                )}
                <button
                  type="button"
                  className="admin-button admin-button--secondary admin-button--small"
                  disabled={busyId !== null}
                  onClick={() => setEditingId(apk.id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="admin-button admin-button--danger admin-button--small"
                  disabled={busyId !== null || apk.isActive}
                  title={apk.isActive ? 'Make another APK active before deleting this one' : undefined}
                  onClick={() => onDelete(apk)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  )
}

type EditRowProps = {
  apk: Apk
  busy: boolean
  onCancel: () => void
  onSave: (details: ApkDetails) => Promise<void>
}

function EditRow({ apk, busy, onCancel, onSave }: EditRowProps) {
  const [versionName, setVersionName] = useState(apk.versionName)
  const [versionCode, setVersionCode] = useState(apk.versionCode?.toString() ?? '')
  const [releaseNotes, setReleaseNotes] = useState(apk.releaseNotes)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void onSave({
      versionName: versionName.trim(),
      versionCode: versionCode.trim() === '' ? null : Number(versionCode),
      releaseNotes: releaseNotes.trim(),
    })
  }

  return (
    <tr className="admin-table__row--editing">
      <td colSpan={4}>
        <form className="admin-edit" onSubmit={handleSubmit}>
          <p className="admin-edit__title">
            Editing <strong>{apk.versionName}</strong> · {apk.originalFileName}
          </p>
          <fieldset className="admin-edit__fields" disabled={busy}>
            <label className="admin-field">
              <span className="admin-field__label">Version name</span>
              <input
                className="admin-input"
                required
                maxLength={50}
                pattern={VERSION_NAME_PATTERN}
                title='Letters, digits, ".", "-", "_" or "+", e.g. 1.4.0'
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">
                Version code <span className="admin-field__optional">(optional)</span>
              </span>
              <input
                className="admin-input"
                type="number"
                inputMode="numeric"
                min={1}
                max={2100000000}
                step={1}
                value={versionCode}
                onChange={(e) => setVersionCode(e.target.value)}
              />
            </label>
            <label className="admin-field admin-edit__notes">
              <span className="admin-field__label">
                Release notes <span className="admin-field__optional">(optional)</span>
              </span>
              <textarea
                className="admin-input admin-textarea"
                rows={3}
                maxLength={2000}
                value={releaseNotes}
                onChange={(e) => setReleaseNotes(e.target.value)}
              />
            </label>
          </fieldset>
          <div className="admin-edit__actions">
            <button className="admin-button admin-button--primary admin-button--small" disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="admin-button admin-button--secondary admin-button--small"
              disabled={busy}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </td>
    </tr>
  )
}
