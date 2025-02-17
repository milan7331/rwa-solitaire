import { Component, AfterViewInit, OnDestroy, OnInit, HostBinding, ElementRef, ChangeDetectorRef,  } from '@angular/core';
import { CommonModule, Location, NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DragDropModule, CdkDragPreview, CdkDragDrop, CdkDragStart, CdkDrag } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, Subject, takeUntil, filter, Observable } from 'rxjs';

import { selectBoard, selectGameEndConditionState } from '../../../store/selectors/solitaire.selectors';
import { solitaireActions } from '../../../store/actions/solitaire.actions';

import { AudioService } from '../../../services/audio/audio.service';
import { HintService } from '../../../services/hint/hint.service';
import { TimerService } from '../../../services/timer/timer.service';
import { ThemeService } from '../../../services/theme/theme.service';

import { Card, CardSuit, CardColor, CardNumber } from '../../../models/solitaire/card';
import { SolitaireBoard } from '../../../models/solitaire/solitaire-board';
import { SolitaireHints } from '../../../models/solitaire/solitaire-hints';
import { SolitaireMove } from '../../../models/solitaire/solitaire-move';
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
export class SolitaireComponent implements AfterViewInit, OnInit, OnDestroy {    
  // dosta posla oko tipova null / undefined etc prepraviti na kraju
  // potrebno prepraviti game end check, već postoji selektor samo ga napraviti da prikazuje prozor etc

  #destroy$: Subject<void> = new Subject<void>();

  difficulty: SolitaireDifficulty;

  board: SolitaireBoard | null;
  hints: SolitaireHints;

  hiddenCards: Card[];
  hiddenCardsIndex: number;

  // možda nepotrebno??
  clickedElementOffsetX: number = 0;
  clickedElementOffsetY: number = 0;

  @HostBinding('class.light-mode')
  get lightModeClassBinding() {
    return this.themeService.lightMode();
  } 

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly store: Store,
    private readonly audioService: AudioService,
    private readonly hintService: HintService,
    private readonly timerService: TimerService,
    private readonly themeService: ThemeService,
  ) {
    this.board = null;
    this.difficulty = this.getGameDifficultyFromRoute();
    this.hints = hintService.getHintsEmpty();

    this.hiddenCards = [];
    this.hiddenCardsIndex = 20;
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

  ngAfterViewInit(): void {
    // document.addEventListener("mousedown", this.clickOffset);
  }

  ngOnDestroy(): void {
    // document.removeEventListener("mousedown", this.clickOffset);

    this.#destroy$.next();
    this.#destroy$.complete();
  }

  getGameDifficultyFromRoute(): SolitaireDifficulty {
    const state = this.location.getState() as { difficulty?: SolitaireDifficulty };
    if (!state) return SolitaireDifficulty.Hard;

    const value = state['difficulty'];
    return value?? SolitaireDifficulty.Hard;
  }
  
  public drawCards(): void {
    if (this.board === null) return;

    this.audioService.play_deckDraw(this.board, this.difficulty);
    this.store.dispatch(solitaireActions.drawCards());
  }

  // private clickOffset = (event: MouseEvent) => {
  //   const target = event.target as HTMLElement;
    
  //   if (target) {
  //     const rect = target.getBoundingClientRect();
  //     this.clickedElementOffsetX = event.clientX - rect.left;
  //     this.clickedElementOffsetY = event.clientY - rect.top;
  //   }
  // }

  // private followCursor = (event: DragEvent) => {
  //   this.cardStackDragged!.style.left = (event.clientX - this.clickedElementOffsetX) + "px";
  //   this.cardStackDragged!.style.top = (event.clientY - this.clickedElementOffsetY) + "px";
  // }

  public showHints(): void {
    if (this.hints === undefined) return;

    this.hints = this.hintService.showHints(this.hints);
  }

  public hideHints(): void {
    if (this.hints === undefined) return;

    this.hints = this.hintService.hideHints(this.hints);

    const highlightedCardStacks = document.querySelectorAll(".highlighted-card-stack");
    const highlightedCards = document.querySelectorAll(".highlighted-card-single");

    highlightedCardStacks.forEach((el) => { el.classList.remove("highlighted-card-stack"); });
    highlightedCards.forEach((el) => { el.classList.remove("highlighted-card-single"); });
  }

  // public isHighlighted(containingStack: Card[], elementIndex: number): boolean {
  //   if (this.hints.hintIndex < 0 || !this.hints.hintVisible) return false;
  //   if (!this.hints.moves[this.hints.hintIndex]) return false;
    
  //   let selectedHint: SolitaireMove = this.hints.moves[this.hints.hintIndex];
    
  //   // source highlight
  //   if (selectedHint.source === containingStack && selectedHint.sourceIndex === elementIndex) return true;
    
  //   // dest highlight
  //   if (selectedHint.dest === containingStack && containingStack.length - 1 === elementIndex) return true;

  //   return false;
  // }

  // public isHighlighted_deck(): boolean {
  //   if (!this.hints.hintVisible) return false;
  //   return this.hints.cycleDeck;
  // }

  // public isHighlighted_placeholder(containingStack: Card[]): boolean {
  //   if (this.hints.hintIndex < 0 || !this.hints.hintVisible) return false;
  //   if (!this.hints.moves[this.hints.hintIndex]) return false;
  
  //   let selectedHint: SolitaireMove = this.hints.moves[this.hints.hintIndex];
  
  //   // placeholder highlight
  //   return selectedHint.dest === containingStack && containingStack.length === 0;
    
  // }
  
  public dragStart(arrayToHide?: Card[], index?: number) {
    // this.hideHints();

    if (!this.board) return;

    if (arrayToHide !== undefined && index !== undefined) {
      this.hiddenCards = arrayToHide;
      this.hiddenCardsIndex = index + 1;
    }

    this.audioService.play_cardPickUp();

    //document.addEventListener('drag', this.followCursor);
  }

  public dragRelease() {
    this.hiddenCards = [];
    this.hiddenCardsIndex = 20;

    this.audioService.play_cardDropUnsuccessful();
    this.dragAndDropCleanUp();
  }

  public dropOnFoundation(event: CdkDragDrop<Card[]>): void {
    if (!this.board) return;
    if (event.container.data === event.previousContainer.data) return;

    const lastMove = this.board.moveNumber;

    this.store.dispatch(solitaireActions.dropOnFoundation({
      src: event.previousContainer.data,
      dest: event.container.data,
      srcIndex: event.previousIndex
    }));

    if (this.board.moveNumber > lastMove) this.cardDroppedSuccessfuly();
  }

  public dropOnTableau(event: CdkDragDrop<Card[]>): void {
    if (!this.board) return;
    if (event.container.data === event.previousContainer.data) return;


    const lastMove = this.board.moveNumber;

    this.store.dispatch(solitaireActions.dropOnTableau({
      src: event.previousContainer.data,
      dest: event.container.data,
      srcIndex: event.previousIndex
    }));

    if (this.board.moveNumber > lastMove) this.cardDroppedSuccessfuly();
  }

  private cardDroppedSuccessfuly(): void {
    this.audioService.play_cardDropSuccessful();
    this.dragAndDropCleanUp();
  }

  public getFoundationBg(index: number): string {
    switch (index) {
      case 0: return "url('/cards/clubs_placeholder.svg')";
      case 1: return "url('/cards/diamonds_placeholder.svg')";
      case 2: return "url('/cards/hearts_placeholder.svg')";
      case 3: return "url('/cards/spades_placeholder.svg')";
      default: return "url('/cards/placeholder.svg')"
    }
  }

  private dragAndDropCleanUp(): void {
    // document.removeEventListener('drag', this.followCursor);
  }
}