import { Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Store } from '@ngrx/store';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { AudioService } from '../../../services/app/audio/audio.service';

import { solitaireActions } from '../../../store/actions/solitaire.actions';
import { SolitaireDifficulty } from '../../../models/solitaire/solitaire-difficulty';
import { selectGameDifficultyState, selectUndoAvailability } from '../../../store/selectors/solitaire.selectors';

@Component({
  selector: 'app-game-control',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './game-control.component.html',
  styleUrl: './game-control.component.scss',
  standalone: true
})
export class GameControlComponent implements OnInit {
  #difficulty$: Observable<SolitaireDifficulty>;
  undoAvailable$: Observable<boolean>;

  #difficulty: SolitaireDifficulty;

  @Output()
  hintButtonPressed: EventEmitter<void>;

  constructor(
    private readonly store: Store,
    private readonly audioService: AudioService,
    private readonly destroyRef: DestroyRef,
  ) {
    this.#difficulty$ = of(SolitaireDifficulty.Hard);
    this.undoAvailable$ = of(false);

    this.#difficulty = SolitaireDifficulty.Hard;

    this.hintButtonPressed = new EventEmitter<void>();
  }

  ngOnInit(): void {
    this.#difficulty$ = this.store.select(selectGameDifficultyState);
    this.undoAvailable$ = this.store.select(selectUndoAvailability);

    this.#difficulty$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(diff => this.#difficulty = diff);
  }

  public startNewGame(): void {
    this.audioService.play_buttonPress();
    this.store.dispatch(solitaireActions.startNewGame({ difficulty: this.#difficulty ?? SolitaireDifficulty.Hard }));
  }

  public restartGame(): void {
    this.audioService.play_buttonPress();
    this.store.dispatch(solitaireActions.restartGame());
  }

  public undoMove(): void {
    this.audioService.play_undo();
    this.store.dispatch(solitaireActions.undo());
  }

  public getHints(): void {
    this.audioService.play_buttonPress();
    this.hintButtonPressed.emit();
  }

  public changeDifficulty(): void {
    this.audioService.play_buttonPress();
    const newDiff = this.#difficulty === SolitaireDifficulty.Hard ? SolitaireDifficulty.Easy : SolitaireDifficulty.Hard; 
    this.store.dispatch(solitaireActions.startNewGame({ difficulty: newDiff }));
  }
}
