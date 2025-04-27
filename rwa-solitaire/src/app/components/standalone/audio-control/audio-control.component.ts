import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { AudioService } from '../../../services/app/audio/audio.service';
import { selectAudioVolume, selectAudioVolumeIcon } from '../../../store/selectors/audio.selectors';
import { audioActions } from '../../../store/actions/audio.actions';

@Component({
  selector: 'app-audio-control',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatSliderModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './audio-control.component.html',
  styleUrl: './audio-control.component.scss',
  standalone: true
})
export class AudioControlComponent implements OnDestroy, OnInit {
  #destroy$: Subject<void>;
  volumeIcon$: Observable<string>;
  audioVolume$: Observable<number>;

  constructor(
    private store: Store,
    private audio: AudioService,
  ) {
    this.#destroy$ = new Subject<void>();
    this.volumeIcon$ = of('volume_up');
    this.audioVolume$ = of(0.8);
  }

  ngOnInit(): void {
    this.volumeIcon$ = this.store.select(selectAudioVolumeIcon);
    this.audioVolume$ = this.store.select(selectAudioVolume);
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  changeVolume(value: number): void {
    if (value !== 0) this.store.dispatch(audioActions.unmute());
    this.store.dispatch(audioActions.setVolume({ value }));
    this.audio.play_notification();
  }

  toggleMute(): void {
    this.store.dispatch(audioActions.toggleMute());
    this.audio.play_buttonPress();
  }
}
