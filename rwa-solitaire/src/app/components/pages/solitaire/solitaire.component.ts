import { Component, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { CommonModule, Location, NgTemplateOutlet } from '@angular/common';
import { Store } from '@ngrx/store';
import { DragDropModule, CdkDragDrop, Point } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil, filter } from 'rxjs';

import { selectBoard } from '../../../store/selectors/solitaire.selectors';
import { solitaireActions } from '../../../store/actions/solitaire.actions';

import { AudioService } from '../../../services/app/audio/audio.service';
import { HintService } from '../../../services/game/hint/hint.service';
import { TimerService } from '../../../services/game/timer/timer.service';
import { ThemeService } from '../../../services/app/theme/theme.service';

import { Card} from '../../../models/solitaire/card';
import { SolitaireBoard } from '../../../models/solitaire/solitaire-board';
import { SolitaireMove } from '../../../models/solitaire/solitaire-move';
import { SolitaireHints } from '../../../models/solitaire/solitaire-hints';
import { SolitaireDifficulty } from '../../../models/solitaire/solitaire-difficulty';

import { GameInfoComponent } from "../../standalone/game-info/game-info.component";
import { GameControlComponent } from "../../standalone/game-control/game-control.component";

@Component({
  selector: 'app-solitaire',
  imports: [
    CommonModule,
    DragDropModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent,
    GameControlComponent,
    NgTemplateOutlet,
],
  templateUrl: './solitaire.component.html',
  styleUrl: './solitaire.component.scss',
  standalone: true
})
export class SolitaireComponent implements OnInit, OnDestroy {    
  difficulty: SolitaireDifficulty;
  
  board: SolitaireBoard | null;
  hints: SolitaireHints;
  
  hiddenCards: Card[];
  hiddenCardsIndex: number;
  
  #destroy$: Subject<void>;
  #clickOffset: Point;

  @HostBinding('class.light-mode')
  get lightModeClassBinding() {
    return this.themeService.lightMode();
  } 

  constructor(
    private readonly location: Location,
    private readonly store: Store,
    private readonly audioService: AudioService,
    private readonly hintService: HintService,
    private readonly timerService: TimerService,
    private readonly themeService: ThemeService,
  ) {
    this.difficulty = this.#getGameDifficultyFromRoute();
    
    this.board = null;
    this.hints = hintService.getHintsEmpty();
    
    this.hiddenCards = [];
    this.hiddenCardsIndex = 20;
    
    this.#destroy$ = new Subject<void>();
    this.#clickOffset = { x: 0, y: 0 } as Point;
  }

  ngOnInit(): void {
    this.store.dispatch(solitaireActions.startNewGame({ difficulty: this.difficulty }));
    const board$ = this.store.select(selectBoard);

    board$.pipe(
      takeUntil(this.#destroy$),
      filter(board => board !== undefined)
    ).subscribe((board) => {
      this.board = board;
      this.hints = this.hintService.getHints(board);
    });
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  drawCards(): void {
    if (this.board === null) return;

    this.audioService.play_deckDraw(this.board, this.difficulty);
    this.store.dispatch(solitaireActions.drawCards());
  }

  showHints(): void {
    if (this.hints === undefined) return;

    this.hints = this.hintService.showHints(this.hints);
  }

  hideHints(): void {
    if (this.hints === undefined) return;

    this.hints = this.hintService.hideHints(this.hints);
  }

  isHighlighted(containingStack: Card[], elementIndex: number): boolean {
    if (this.hints.hintIndex < 0 || !this.hints.hintVisible) return false;
    if (!this.hints.moves[this.hints.hintIndex]) return false;
    
    let selectedHint: SolitaireMove = this.hints.moves[this.hints.hintIndex];
    
    // source highlight
    if (selectedHint.source === containingStack && selectedHint.sourceIndex === elementIndex) return true;
    
    // dest highlight
    if (selectedHint.dest === containingStack && containingStack.length - 1 === elementIndex) return true;

    // placeholder highlight !!! elementIndex needs to be -1 for this case !!!
    if (selectedHint.dest === containingStack && containingStack.length === 0 && elementIndex === -1) return true;

    return false;
  }

  isHighlighted_deck(): boolean {
    if (!this.hints.hintVisible) return false;
    return this.hints.cycleDeck;
  }

  getClickOffset(event: MouseEvent): void {
    if (!event) this.#clickOffset = { x: 0, y: 0 };

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    this.#clickOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    } as Point;
  }
  
  dragStart(arrayToHide?: Card[], index?: number) {
    if (!this.board) return;
    
    this.hideHints();
    this.audioService.play_cardPickUp();
    
    const container: HTMLElement | null = document.querySelector(".cdk-drag-preview");
    if (container) { container.style.overflow = 'visible'; }

    const element: HTMLElement | null = document.querySelector("#dragPreview");
    if (element) {
      element.style.overflow = 'visible'
      element.style.position = 'relative';
      element.style.left = '-' + this.#clickOffset.x + 'px';
      element.style.top = '-' + this.#clickOffset.y + 'px';

    }
    if (arrayToHide !== undefined && index !== undefined) {
      this.hiddenCards = arrayToHide;
      this.hiddenCardsIndex = index + 1;
    }
  }

  dragRelease() {
    this.hiddenCards = [];
    this.hiddenCardsIndex = 20;

    this.audioService.play_cardDropUnsuccessful();
  }

  dropOnFoundation(event: CdkDragDrop<Card[]>): void {
    if (!this.board) return;
    if (event.container.data === event.previousContainer.data) return;

    const lastMove = this.board.moveNumber;

    this.store.dispatch(solitaireActions.dropOnFoundation({
      src: event.previousContainer.data,
      dest: event.container.data,
      srcIndex: event.previousIndex
    }));

    if (this.board.moveNumber > lastMove) this.#cardDroppedSuccessfuly();
  }

  dropOnTableau(event: CdkDragDrop<Card[]>): void {
    if (!this.board) return;
    if (event.container.data === event.previousContainer.data) return;


    const lastMove = this.board.moveNumber;

    this.store.dispatch(solitaireActions.dropOnTableau({
      src: event.previousContainer.data,
      dest: event.container.data,
      srcIndex: event.previousIndex
    }));

    if (this.board.moveNumber > lastMove) this.#cardDroppedSuccessfuly();
  }

  
  getFoundationBg(index: number): string {
    switch (index) {
      case 0: return "url('/cards/clubs_placeholder.svg')";
      case 1: return "url('/cards/diamonds_placeholder.svg')";
      case 2: return "url('/cards/hearts_placeholder.svg')";
      case 3: return "url('/cards/spades_placeholder.svg')";
      default: return "url('/cards/placeholder.svg')"
    }
  }

  #getGameDifficultyFromRoute(): SolitaireDifficulty {
    const state = this.location.getState() as { difficulty?: SolitaireDifficulty };
    if (!state) return SolitaireDifficulty.Hard;

    const value = state['difficulty'];
    return value?? SolitaireDifficulty.Hard;
  }

  #cardDroppedSuccessfuly(): void {
    this.audioService.play_cardDropSuccessful();
  }
}