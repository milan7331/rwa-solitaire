import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AudioService } from '../../../services/audio/audio.service';
import { Store } from '@ngrx/store';
import { solitaireActions } from '../../../store/actions/solitaire.actions';
import { visibilityActions } from '../../../store/actions/visibility.actions';
import { selectGameDifficulty, selectGameEndState, selectUndoAvailability } from '../../../store/selectors/solitaire.selectors';
import { Observable, Subject, takeUntil, filter, startWith } from 'rxjs';
import { SolitaireDifficulty } from '../../../models/solitaire/solitaire-board';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.scss'
})
export class BottomBarComponent implements OnInit {
  @Output() hint = new EventEmitter<void>();

  #destroy$: Subject<void> = new Subject<void>();
  undoAvailable$: Observable<boolean>;
  gameEnd$: Observable<boolean>;

  gameDifficulty: SolitaireDifficulty = SolitaireDifficulty.Hard;

  showNewGameDialog: boolean = false;
  showRestartGameDialog: boolean = false;
  showChangeDifficultyDialog: boolean = false;
  showGameEndDialog: boolean = false;

  // hints??

  constructor(private audio: AudioService, private store: Store, private router: Router) {
    this.undoAvailable$ = this.store.select(selectUndoAvailability);
    this.gameEnd$ = this.store.select(selectGameEndState).pipe(startWith(false));
  }

  ngOnInit() {
    this.store.select(selectGameDifficulty).pipe(
      takeUntil(this.#destroy$),
      filter(diff => diff !== undefined)
    ).subscribe(diff => {
        this.gameDifficulty = diff!;
    });

    this.gameEnd$.subscribe(value => {
      this.showGameEndDialog = value ?? false;
    })
  }

  // OPEN DIALOG BUTTONS
  pressed_toggleNewGameDialog(): void {
    this.audio.play_buttonPress();
    this.showNewGameDialog = !this.showNewGameDialog;
  }

  pressed_toggleRestartGameDialog(): void {
    this.audio.play_buttonPress();
    this.showRestartGameDialog = !this.showRestartGameDialog;
  }

  pressed_toggleChangeDifficultyDialog(): void {
    this.audio.play_buttonPress();
    this.showChangeDifficultyDialog = !this.showChangeDifficultyDialog;
  }

  pressed_toggleEndGameDialog(): void {
    this.audio.play_buttonPress();
    this.showGameEndDialog = !this.showGameEndDialog;
  }


  pressed_startNewGameButton(): void {
    this.audio.play_buttonPress();
    this.store.dispatch(solitaireActions.startNewGame({difficulty: this.gameDifficulty}));
    this.pressed_toggleNewGameDialog();
  }

  pressed_restartGameButton(): void {
    this.audio.play_buttonPress();
    this.store.dispatch(solitaireActions.restartGame());
    this.pressed_toggleRestartGameDialog();
  }
  
  pressed_changeDifficultyButton(): void {
    const newDiff = (this.gameDifficulty === SolitaireDifficulty.Hard)? SolitaireDifficulty.Easy : SolitaireDifficulty.Hard;

    this.audio.play_buttonPress();
    this.store.dispatch(solitaireActions.startNewGame({difficulty: newDiff}));
    this.pressed_toggleNewGameDialog();
  }

  pressed_showHint(): void {
    this.audio.play_buttonPress();
    this.hint.emit();
  }
  
  pressed_undo(): void {
    this.audio.play_buttonPress();
    this.store.dispatch(solitaireActions.undo());
  }


  pressed_navigateHome(): void {
    this.router.navigate(["/home"]);
  }
}
