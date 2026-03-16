const API_BASE_URL = 'http://localhost:3001'

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | object
>

function buildUrl(path: string, params?: QueryParams): string {
  const url = new URL(path, API_BASE_URL)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '') return
      const serialized =
        typeof value === 'object' ? JSON.stringify(value) : String(value)
      url.searchParams.append(key, serialized)
    })
  }
  return url.toString()
}

export async function fetchJson<T>(path: string, params?: QueryParams, signal?: AbortSignal): Promise<T> {
  const response = await fetch(buildUrl(path, params), { signal })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(
      text || `Request to ${path} failed with status ${response.status}`,
    )
  }

  return (await response.json()) as T
}

