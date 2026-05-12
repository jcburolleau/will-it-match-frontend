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
      stream: true,
    }),
    signal: opts.signal,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Ollama chat failed (${res.status}): ${text}`)
  }

  const reader = res.body?.getReader()
  if (!reader) throw new Error('No response stream')

  const decoder = new TextDecoder()
  let full = ''

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    for (const line of chunk.split('\n')) {
      if (!line.trim()) continue
      try {
        const obj = JSON.parse(line) as { message?: { content?: string }; error?: string; done?: boolean }
        if (obj.error) throw new Error(obj.error)
        full += obj.message?.content ?? ''
      } catch (e) {
        if (e instanceof SyntaxError) continue
        throw e
      }
    }
  }

  return full
}
