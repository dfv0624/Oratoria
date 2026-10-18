import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  ElementRef,
  viewChildren
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PassageService } from '../../services/passage.service';
import { SpeechService } from '../../services/speech.service';
import { AudioRecorderService } from '../../services/audio-recorder.service';
import { TimerService } from '../../services/timer.service';
import { Passage, PassageLine, MemorizationMode } from '../../models/passage.model';

@Component({
  selector: 'app-practice-view',
  imports: [RouterLink],
  templateUrl: './practice-view.component.html',
  styleUrl: './practice-view.component.css'
})
export class PracticeViewComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly passageService = inject(PassageService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly speechService = inject(SpeechService);
  readonly audioRecorderService = inject(AudioRecorderService);
  readonly timerService = inject(TimerService);

  readonly passage = signal<Passage | null>(null);
  readonly currentMode = signal<MemorizationMode>(2);
  readonly useWakachi = signal<boolean>(false);
  readonly playbackSpeed = signal<number>(0.6);
  readonly optionsCollapsed = signal<boolean>(true);
  readonly activePlayingIndex = signal<number | null>(null);
  readonly isPlayingAll = signal<boolean>(false);
  readonly showVideo = signal<boolean>(false);

  readonly videoEmbedUrl = computed<SafeResourceUrl | null>(() => {
    const currentPassage = this.passage();
    if (!currentPassage?.youtubeId) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${currentPassage.youtubeId}?rel=0`
    );
  });

  // References to line cards for auto-scrolling
  readonly lineCards = viewChildren<ElementRef<HTMLElement>>('lineCard');

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      const found = this.passageService.getPassageById(id);
      if (found) {
        this.passage.set(found);
        this.resetState();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopPlayback();
    this.audioRecorderService.clearAudios();
  }

  private resetState(): void {
    this.stopPlayback();
    this.audioRecorderService.clearAudios();
    this.currentMode.set(2);
    this.optionsCollapsed.set(true);
    this.showVideo.set(false);
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleVideo(): void {
    this.showVideo.update((v) => !v);
  }

  toggleOptions(): void {
    this.optionsCollapsed.update((v) => !v);
  }

  setMode(mode: MemorizationMode): void {
    this.currentMode.set(mode);
  }

  toggleWakachi(): void {
    this.useWakachi.update((v) => !v);
  }

  onSpeedChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const speed = parseFloat(target.value) || 0.6;
    this.playbackSpeed.set(speed);
  }

  playSingleLine(idx: number): void {
    const currentPassage = this.passage();
    if (!currentPassage) return;

    this.stopPlayback();
    this.activePlayingIndex.set(idx);
    this.scrollToLine(idx);

    this.speechService.speak(
      currentPassage.lines[idx].jp,
      this.playbackSpeed(),
      () => {
        if (!this.isPlayingAll()) {
          this.activePlayingIndex.set(null);
        }
      },
      () => {
        this.activePlayingIndex.set(null);
      }
    );
  }

  startContinuousPlayback(): void {
    const currentPassage = this.passage();
    if (!currentPassage || currentPassage.lines.length === 0) return;

    this.isPlayingAll.set(true);
    this.timerService.reset();
    this.timerService.start();
    this.playStep(0);
  }

  private playStep(idx: number): void {
    const currentPassage = this.passage();
    if (!this.isPlayingAll() || !currentPassage || idx >= currentPassage.lines.length) {
      this.stopPlayback();
      return;
    }

    this.activePlayingIndex.set(idx);
    this.scrollToLine(idx);

    this.speechService.speak(
      currentPassage.lines[idx].jp,
      this.playbackSpeed(),
      () => {
        if (this.isPlayingAll()) {
          this.playStep(idx + 1);
        }
      },
      () => {
        this.stopPlayback();
      }
    );
  }

  stopPlayback(): void {
    this.isPlayingAll.set(false);
    this.speechService.cancel();
    this.timerService.stop();
    this.activePlayingIndex.set(null);
  }

  private scrollToLine(idx: number): void {
    if (!this.isBrowser) return;
    const cards = this.lineCards();
    if (cards && cards[idx]) {
      cards[idx].nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  handleRecord(idx: number, event: MouseEvent): void {
    event.stopPropagation();
    this.audioRecorderService.toggleRecord(idx);
  }

  playUserRecording(idx: number, event: MouseEvent): void {
    event.stopPropagation();
    this.audioRecorderService.playRecording(idx);
  }

  hasAudio(idx: number): boolean {
    return !!this.audioRecorderService.userAudios()[idx];
  }

  isRecording(idx: number): boolean {
    return this.audioRecorderService.recordingLineIndex() === idx;
  }

  // Cloze segment helper
  getClozeSegments(line: PassageLine): { text: string; isBlank: boolean }[] {
    const parts = line.cloze.split('______');
    const result: { text: string; isBlank: boolean }[] = [];
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
        result.push({ text: parts[i], isBlank: false });
      }
      if (i < parts.length - 1) {
        result.push({ text: '______', isBlank: true });
      }
    }
    return result;
  }
}
