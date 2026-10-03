import type { OcrVersion } from './api'

type VersionInfo = {
  label: string
  /** What runs on the endpoint. */
  model: string
  /** RunPod serverless price of the endpoint's GPU pool while a worker runs. */
  hourlyCost: string
  /** How long a cold worker takes to boot. */
  boot: string
  /** The server setting that names this version's endpoint. */
  endpointVar: string
}

const VERSIONS: Record<OcrVersion, VersionInfo> = {
  v5: {
    label: 'v5',
    model: 'Qwen3-VL 2B · KTP',
    hourlyCost: '$0.58/hr',
    boot: 'a minute or two',
    endpointVar: 'RUNPOD_OCR_V5_ENDPOINT_ID',
  },
  v6: {
    label: 'v6',
    model: 'Qwen3-VL 4B · KTP and KK',
    // Its pools are AMPERE_16 ($0.58/hr) and, when those are out, RTX 4090 ($1.10/hr).
    hourlyCost: '$0.58–1.10/hr',
    boot: 'two to three minutes',
    endpointVar: 'RUNPOD_OCR_V6_ENDPOINT_ID',
  },
}

/** A version the server knows but this build doesn't still gets a usable card. */
export function versionInfo(version: string): VersionInfo {
  return (
    VERSIONS[version as OcrVersion] ?? {
      label: version,
      model: '',
      hourlyCost: 'the GPU rate',
      boot: 'a few minutes',
      endpointVar: "its endpoint's setting",
    }
  )
}
