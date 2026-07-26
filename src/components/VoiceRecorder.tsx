'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { authFetch } from '@/lib/api-client'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

type Props = {
  onTranscription: (text: string) => void
}

export default function VoiceRecorder({ onTranscription }: Props) {
  const { t } = useT()
  const { user } = useAuth()
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      })

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm'

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        const audioBlob = new Blob(chunksRef.current, { type: mimeType })
        await transcribeAudio(audioBlob, mimeType)
      }

      mediaRecorder.start(1000)
      setIsRecording(true)
    } catch (error) {
      console.error('Erreur accès micro:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob, mimeType: string) => {
    setIsTranscribing(true)
    try {
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm'
      const formData = new FormData()
      formData.append('audio', audioBlob, `dream-recording.${ext}`)
      if (user?.id) formData.append('userId', user.id)

      const res = await authFetch('/api/transcribe', { method: 'POST', body: formData })
      const data = await res.json()

      if (data.text) {
        onTranscription(data.text)
      }
    } catch (error) {
      console.error('Erreur transcription:', error)
    } finally {
      setIsTranscribing(false)
    }
  }

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isTranscribing}
      style={{
        width: 38, height: 38, borderRadius: '50%',
        display: 'grid', placeItems: 'center', flexShrink: 0,
        cursor: isTranscribing ? 'wait' : 'pointer',
        background: isRecording ? T.gold : T.card,
        border: `1px solid ${isRecording ? T.gold : T.line}`,
        color: isRecording ? T.bgFlat : T.dim,
        opacity: isTranscribing ? 0.4 : 1,
        animation: isRecording ? 'pulse-record 1.5s ease-in-out infinite' : 'none',
      }}
      title={isRecording ? t('screens.voice.stop') : isTranscribing ? t('screens.voice.transcribing') : t('screens.voice.record')}
    >
      {isTranscribing ? (
        <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      ) : isRecording ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      )}
    </button>
  )
}
