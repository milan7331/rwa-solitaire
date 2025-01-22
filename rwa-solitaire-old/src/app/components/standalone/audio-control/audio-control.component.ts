import { Component, OnDestroy, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AudioService } from '../../../services/audio/audio.service';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectAppMuted, selectAppVolume } from '../../../store/selectors/audio.selectors';
import { volumeControlActions } from '../../../store/actions/audio.actions';

@Component({
  selector: 'app-audio-control',
  templateUrl: './audio-control.component.html',
  styleUrl: './audio-control.component.scss'
})
export class AudioControlComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public overlayVisible: boolean = false;
  public muted: boolean = false;
  public volume: number = 0.8;

  @ViewChild('op') opElement!: OverlayPanel;

  constructor(private store: Store, private audio: AudioService) {
    this.store.select(selectAppVolume)
      .pipe(takeUntil(this.destroy$))
      .subscribe((volume) => this.volume = volume);

    this.store.select(selectAppMuted)
      .pipe(takeUntil(this.destroy$))
      .subscribe((muted) => this.muted = muted);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get volumeIcon(): string {
    if (this.volume === 0.0) return 'pi pi-volume-off';
    else if (this.volume > 0.0 && this.volume <= 0.33) return 'pi pi-volume-down';
    else return 'pi pi-volume-up';
  }

  get buttonLabel(): string {
    if (this.muted) return 'Muted';
    return '';
  }

  get buttonSeverity(): "success" | "info" | "warning" | "danger" | "help" | "primary" | "secondary" | "contrast" | null | undefined {
    if (this.muted) return "danger";
    return "primary";
  }

  public toggleOverlay(event: Event): void {
    this.audio.play_buttonPress();
    this.opElement.toggle(event);
  }

  public toggleMute(): void {
    this.store.dispatch(volumeControlActions.toggleMute());
    this.audio.play_buttonPress();
  }

  public changeVolume(): void {
    this.store.dispatch(volumeControlActions.setVolume({value: this.volume}));
  }
  
}
