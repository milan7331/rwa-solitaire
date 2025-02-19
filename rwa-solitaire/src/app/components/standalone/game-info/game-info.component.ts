import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TimerService } from '../../../services/timer/timer.service';
import { Observable, of } from 'rxjs';
import { SolitaireDifficulty } from '../../../models/solitaire/solitaire-difficulty';
import { selectCurrentMoveNumber, selectGameDifficultyState } from '../../../store/selectors/solitaire.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-info',
  imports: [
    CommonModule
  ],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.scss',
  standalone: true
})
export class GameInfoComponent implements OnInit {
  difficulty = SolitaireDifficulty;

  formattedTime$: Observable<string>; 
  currentMove$: Observable<number>;
  gameDifficulty$: Observable<SolitaireDifficulty>;

  constructor(
    private readonly store: Store,
    private readonly timerService: TimerService
  ) {
    this.formattedTime$ = of('00:00');
    this.currentMove$ = of(0);
    this.gameDifficulty$ = of(SolitaireDifficulty.Hard);
  }

  ngOnInit(): void {
    this.formattedTime$ = this.timerService.formatedTime$;
    this.currentMove$ = this.store.select(selectCurrentMoveNumber);
    this.gameDifficulty$ = this.store.select(selectGameDifficultyState);
  }
}