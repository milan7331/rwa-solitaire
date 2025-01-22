import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'
import { AudioService } from '../../../services/audio/audio.service';
import { Store } from '@ngrx/store';
import { selectGameDifficulty } from '../../../store/selectors/solitaire.selectors';
import { Observable, Subscription, filter, map } from 'rxjs';
import { SolitaireDifficulty } from '../../../models/solitaire/solitaire-board';
import { TimerService } from '../../../services/timer/timer.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  gameDifficulty$: Observable<string>;
  timeString$: Observable<string>;

  constructor(private router: Router, private audio: AudioService, private store: Store, private timer: TimerService) {
    this.gameDifficulty$ = this.store.select(selectGameDifficulty).pipe(
      filter(diff => diff !== undefined),
      map(diff => (diff === SolitaireDifficulty.Easy)? 'Easy' : 'Hard')
    );

    this.timeString$ = this.timer.formatedTime$;
  }

  loadHomePage(): void {
    this.router.navigate(["/home"]);
    this.audio.play_buttonPress();
  }
}
