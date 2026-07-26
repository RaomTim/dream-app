/**
 * SSE client helper — async generator for streaming Server-Sent Events over fetch (POST-safe).
 *
 * Usage:
 *   for await (const event of streamSSE('/api/chat', { method: 'POST', body: ... })) {
 *     if (event.type === 'chunk') appendText(event.content)
 *     if (event.type === 'done')  setMetadata(event.metadata)
 *     if (event.type === 'error') handleError(event.message)
 *   }
 *
 * Pass an AbortController signal via init.signal to cancel mid-stream.
 * Works with authFetch headers — call authFetch yourself and pass the Response,
 * OR use the convenience wrapper streamSSEAuthed() which handles the Bearer header.
 */

import { authFetch } from '@/lib/api-client'

export type SSEChunkEvent = { type: 'chunk'; content: string }
export type SSEDoneEvent  = { type: 'done';  metadata: Record<string, unknown> }
export type SSEErrorEvent = { type: 'error'; message: string }
export type SSEEvent = SSEChunkEvent | SSEDoneEvent | SSEErrorEvent

/**
 * Core parser — takes a raw Response whose body is an SSE stream and yields typed events.
 * Handles partial lines correctly (a single SSE data line may arrive split across multiple chunks).
 */
export async function* parseSSEResponse(response: Response): AsyncGenerator<SSEEvent> {
  if (!response.ok) {
    // HTTP-level error — yield a synthetic error event
    let msg = `HTTP ${response.status}`
    try {
      const body = await response.json()
      msg = body.error || body.response || msg
    } catch { /* ignore */ }
    yield { type: 'error', message: msg }
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    yield { type: 'error', message: 'No response body' }
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // SSE lines are separated by \n\n (double newline = event boundary)
      const parts = buffer.split('\n\n')
      // Keep the last (possibly incomplete) chunk in the buffer
      buffer = parts.pop() ?? ''

      for (const part of parts) {
        const lines = part.split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw || raw === '[DONE]') continue
          try {
            const event = JSON.parse(raw) as SSEEvent
            yield event
          } catch {
            // Malformed JSON — skip silently (network glitch)
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * Convenience wrapper: calls authFetch (injects Bearer header) then parses SSE.
 *
 * @param input  URL
 * @param init   Same as fetch RequestInit — include signal for AbortController
 */
export async function* streamSSE(
  input: string,
  init: RequestInit
): AsyncGenerator<SSEEvent> {
  let response: Response
  try {
    response = await authFetch(input, init)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error'
    yield { type: 'error', message: msg }
    return
  }
  yield* parseSSEResponse(response)
}
