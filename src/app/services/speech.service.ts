import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private synth: SpeechSynthesis | null = null;
  private jaVoices: SpeechSynthesisVoice[] = [];
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  readonly isSpeaking = signal(false);

  constructor() {
    if (this.isBrowser && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
    }
  }

  private initVoices(): void {
    if (!this.synth) return;

    const loadVoices = () => {
      this.jaVoices = this.getJapaneseVoices();
    };

    loadVoices();
    if ('onvoiceschanged' in this.synth) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  private getJapaneseVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    const all = this.synth.getVoices() || [];
    return all
      .filter(v => {
        const lang = (v.lang || '').replace('_', '-').toLowerCase();
        return lang.startsWith('ja');
      })
      .sort((a, b) => {
        const score = (v: SpeechSynthesisVoice) => {
          const name = (v.name || '').toLowerCase();
          if (name.includes('enhanced') || name.includes('premium') || name.includes('natural')) return 4;
          if (name.includes('siri')) return 3;
          if (name.includes('kyoko') || name.includes('otoya') || name.includes('nanami') || name.includes('keita')) return 2;
          return 1;
        };
        return score(b) - score(a);
      });
  }

  speak(text: string, rate: number = 0.6, onComplete?: () => void, onError?: (err: unknown) => void): void {
    if (!this.isBrowser || !this.synth) {
      if (onComplete) onComplete();
      return;
    }

    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.cancel();
    } catch (err) {
      console.warn('Error resetting synthesis:', err);
    }

    if (!this.jaVoices || this.jaVoices.length === 0) {
      this.jaVoices = this.getJapaneseVoices();
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    utter.volume = 1.0;
    utter.pitch = 1.0;
    utter.rate = rate;

    if (this.jaVoices.length > 0) {
      utter.voice = this.jaVoices[0];
    }

    this.activeUtterance = utter;
    (window as unknown as { __safariActiveUtterance?: SpeechSynthesisUtterance }).__safariActiveUtterance = utter;

    this.isSpeaking.set(true);

    let hasFinished = false;
    const finish = () => {
      if (hasFinished) return;
      hasFinished = true;
      this.activeUtterance = null;
      (window as unknown as { __safariActiveUtterance?: unknown }).__safariActiveUtterance = null;
      this.isSpeaking.set(false);
      if (onComplete) {
        setTimeout(onComplete, 350);
      }
    };

    utter.onend = finish;
    utter.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      try {
        if (this.synth?.paused) this.synth.resume();
      } catch (_) {}
      this.isSpeaking.set(false);
      if (onError) onError(e);
      finish();
    };

    setTimeout(() => {
      try {
        if (this.synth?.paused) this.synth.resume();
        this.synth?.speak(utter);
      } catch (err) {
        console.warn('Error speaking utterance:', err);
        finish();
      }
    }, 40);
  }

  cancel(): void {
    if (!this.isBrowser || !this.synth) return;
    try {
      this.synth.cancel();
    } catch (_) {}
    this.activeUtterance = null;
    this.isSpeaking.set(false);
  }
}
