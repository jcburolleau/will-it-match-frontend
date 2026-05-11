export interface OllamaModel {
  name: string
  size: number
  modified_at: string
}

export type ConnectionStatus =
  | { ok: true; models: OllamaModel[] }
  | { ok: false; reason: 'unreachable' | 'cors' | 'unknown'; message: string }

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function checkConnection(baseUrl: string): Promise<ConnectionStatus> {
  try {
    const res = await fetch(`${baseUrl}/api/tags`)
    if (!res.ok) {
      return { ok: false, reason: 'unknown', message: `Ollama responded with ${res.status}` }
    }
    const data = (await res.json()) as { models?: OllamaModel[] }
    return { ok: true, models: data.models ?? [] }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
      return { ok: false, reason: 'unreachable', message }
    }
    return { ok: false, reason: 'unknown', message }
  }
}

export async function listModels(baseUrl: string): Promise<OllamaModel[]> {
  const status = await checkConnection(baseUrl)
  if (!status.ok) {
    throw new Error(status.message)
  }
  return status.models
}

export interface ChatOptions {
  baseUrl: string
  model: string
  messages: ChatMessage[]
  signal?: AbortSignal
}

export async function chat(opts: ChatOptions): Promise<string> {
  const res = await fetch(`${opts.baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      stream: false,
    }),
    signal: opts.signal,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Ollama chat failed (${res.status}): ${text}`)
  }

  const data = (await res.json()) as {
    message?: { content?: string }
    error?: string
  }
  if (data.error) throw new Error(data.error)
  return data.message?.content ?? ''
}
