import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private activeStream: MediaStream | null = null;
  private currentAudioPlayer: HTMLAudioElement | null = null;

  readonly recordingLineIndex = signal<number | null>(null);
  readonly userAudios = signal<Record<number, string>>({});
  readonly playingLineIndex = signal<number | null>(null);

  private getBestAudioMimeType(): string {
    if (!this.isBrowser || typeof MediaRecorder === 'undefined') return '';
    const candidates = [
      'audio/mp4',
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/aac',
      'audio/ogg;codecs=opus'
    ];
    for (const t of candidates) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return '';
  }

  async toggleRecord(lineIndex: number): Promise<void> {
    if (!this.isBrowser) return;

    if (this.recordingLineIndex() === lineIndex) {
      this.stopRecording();
      return;
    }

    if (this.recordingLineIndex() !== null) {
      this.stopRecording();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: false
        }
      });
      this.activeStream = stream;

      this.audioChunks = [];
      const mimeType = this.getBestAudioMimeType();
      const options = mimeType ? { mimeType } : undefined;

      this.mediaRecorder = new MediaRecorder(stream, options);
      this.recordingLineIndex.set(lineIndex);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const type = mimeType || (this.audioChunks[0] && this.audioChunks[0].type) || 'audio/mp4';
        const blob = new Blob(this.audioChunks, { type });
        const oldUrl = this.userAudios()[lineIndex];
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }
        const audioUrl = URL.createObjectURL(blob);
        this.userAudios.update((prev) => ({
          ...prev,
          [lineIndex]: audioUrl
        }));

        this.recordingLineIndex.set(null);
        this.cleanupStream();
      };

      this.mediaRecorder.start();
    } catch (err) {
      console.warn('Error accessing microphone:', err);
      this.recordingLineIndex.set(null);
      this.cleanupStream();
      alert('No se pudo acceder al micrófono. Por favor revisa los permisos del navegador.');
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  private cleanupStream(): void {
    if (this.activeStream) {
      this.activeStream.getTracks().forEach((track) => track.stop());
      this.activeStream = null;
    }
  }

  playRecording(lineIndex: number): void {
    if (!this.isBrowser) return;

    const url = this.userAudios()[lineIndex];
    if (!url) return;

    if (this.currentAudioPlayer) {
      this.currentAudioPlayer.pause();
      this.currentAudioPlayer = null;
    }

    const audio = new Audio(url);
    audio.volume = 1.0;
    this.currentAudioPlayer = audio;
    this.playingLineIndex.set(lineIndex);

    audio.onended = () => {
      this.playingLineIndex.set(null);
      this.currentAudioPlayer = null;
    };

    audio.onerror = (e) => {
      console.warn('Audio playback error:', e);
      this.playingLineIndex.set(null);
      this.currentAudioPlayer = null;
    };

    audio.play().catch((err) => {
      console.warn('Error playing audio:', err);
      this.playingLineIndex.set(null);
    });
  }

  clearAudios(): void {
    if (!this.isBrowser) return;
    this.stopRecording();
    if (this.currentAudioPlayer) {
      this.currentAudioPlayer.pause();
      this.currentAudioPlayer = null;
    }
    const current = this.userAudios();
    Object.values(current).forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (_) {}
    });
    this.userAudios.set({});
    this.recordingLineIndex.set(null);
    this.playingLineIndex.set(null);
  }
}
