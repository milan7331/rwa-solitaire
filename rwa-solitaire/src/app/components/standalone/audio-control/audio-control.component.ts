import { Component, ViewChild, inject } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AudioService } from '../../../services/audio/audio.service';

@Component({
  selector: 'app-audio-control',
  templateUrl: './audio-control.component.html',
  styleUrl: './audio-control.component.scss'
})
export class AudioControlComponent{
  private _audio: AudioService;
  private _muted: boolean = false;
  private _volume: number = 0.80;

  @ViewChild('op') opElement!: OverlayPanel;

  constructor() {
    this._audio = inject(AudioService);
    this._muted = this._audio.muted;
    this._volume = this._audio.volume;
  }

  get volume(): number {
    return this._volume;
  }

  set volume(value: number) {
    this._volume = value;
    this._audio.volume = value;
  } 
  
  get muted(): boolean {
    return this._muted;
  }

  set muted(value: boolean) {
    this._muted = value;
    this._audio.muted = value;
  }

  get volumeIcon(): string {
    if (this._volume === 0.0) return 'pi pi-volume-off';
    else if (this._volume > 0.0 && this._volume <= 0.33) return 'pi pi-volume-down';
    else return 'pi pi-volume-up';
  }

  get buttonLabel(): string {
    if (this._muted) return 'Muted';
    return '';
  }

  get buttonSeverity(): string {
    if (this._muted) return 'danger';
    return 'primary';
  }

  public toggleOverlay(event: Event): void {
    this._audio.play_buttonPress();
    this.opElement.toggle(event); // Call the toggle method
  }

  public toggleMute(): void {
    this.muted = !this.muted;
    this._audio.play_buttonPress();
  }
  
}
