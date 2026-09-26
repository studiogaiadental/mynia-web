// genia_server's API root, e.g. https://mynia-api.gmedcc.com/api.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')

// Public: serves whichever APK is set active on the /admin page, as a download.
export const APK_DOWNLOAD_URL = `${API_BASE_URL}/apks/active/download`
