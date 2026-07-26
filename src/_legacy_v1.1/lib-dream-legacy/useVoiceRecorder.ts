'use client';

import { useState, useRef, useCallback } from 'react';

/**
 * useVoiceRecorder — Hook réutilisable pour enregistrement vocal + transcription Whisper.
 * Utilisé par DreamCapture (plein écran) et ProtocolGuide (mini-orbe inline).
 */
export type VoiceRecorderState = {
  recording: boolean;
  transcribing: boolean;
  transcript: string;
  setTranscript: (t: string | ((prev: string) => string)) => void;
  toggleRecord: () => void;
  startRecording: () => void;
  stopRecording: () => void;
};

export function useVoiceRecorder(options?: {
  /** Si true, append au transcript existant au lieu de remplacer */
  append?: boolean;
  /** Callback quand une transcription est reçue */
  onTranscript?: (text: string) => void;
  /** 🔒 userId OBLIGATOIRE depuis 2026-04-20 pour /api/transcribe */
  userId?: string;
}): VoiceRecorderState {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const transcribeAudio = useCallback(async (audioBlob: Blob, mimeType: string) => {
    setTranscribing(true);
    try {
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
      const formData = new FormData();
      formData.append('audio', audioBlob, `dream-recording.${ext}`);
      if (options?.userId) formData.append('userId', options.userId);

      const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.text) {
        if (options?.append !== false) {
          setTranscript((prev) => (prev ? prev + ' ' + data.text : data.text));
        } else {
          setTranscript(data.text);
        }
        options?.onTranscript?.(data.text);
      }
    } catch (error) {
      console.error('Erreur transcription:', error);
    } finally {
      setTranscribing(false);
    }
  }, [options]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        await transcribeAudio(audioBlob, mimeType);
      };

      mediaRecorder.start(1000);
      setRecording(true);
    } catch (error) {
      console.error('Erreur accès micro:', error);
    }
  }, [transcribeAudio]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  }, []);

  const toggleRecord = useCallback(() => {
    if (recording) stopRecording();
    else startRecording();
  }, [recording, startRecording, stopRecording]);

  return {
    recording,
    transcribing,
    transcript,
    setTranscript,
    toggleRecord,
    startRecording,
    stopRecording,
  };
}
