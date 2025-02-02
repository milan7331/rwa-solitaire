import { Component, AfterViewInit, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Subject, takeUntil, filter, Observable } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { selectBoard, selectGameDifficulty, selectGameEndConditionState, selectUndoAvailability } from '../../../store/selectors/solitaire.selectors';
import { solitaireActions } from '../../../store/actions/solitaire.actions';

import { AudioService } from '../../../services/audio/audio.service';
import { HintService } from '../../../services/hint/hint.service';
import { TimerService } from '../../../services/timer/timer.service';

import { Card, CardSuit, CardColor, CardNumber } from '../../../models/solitaire/card';
import { SolitaireBoard } from '../../../models/solitaire/solitaire-board';
import { SolitaireHints } from '../../../models/solitaire/solitaire-hints';
import { SolitaireDifficulty } from '../../../models/solitaire/solitaire-difficulty';
import { ThemeService } from '../../../services/theme/theme.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-solitaire',
  imports: [
    DragDropModule,
    MatGridListModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './solitaire.component.html',
  styleUrl: './solitaire.component.scss',
  standalone: true
})
export class SolitaireComponent implements AfterViewInit, OnInit, OnDestroy {    
  // dosta posla oko tipova null / undefined etc prepraviti na kraju
  // potrebno prepraviti game end check, već postoji selektor samo ga napraviti da prikazuje prozor etc

  difficulty = SolitaireDifficulty;

  #destroy$: Subject<void> = new Subject<void>();
  #board$: Observable<SolitaireBoard | undefined> | undefined;

  board: SolitaireBoard | undefined;
  hints: SolitaireHints | undefined;

  draggedCards: Card[] = [];
  draggedCardsStartIndex: number | null = null;
  draggedCardsOrigin: Card[] | null = null;

  // nepotrebno??
  cardStackDragged: HTMLElement | null = null;
  ghostImage: HTMLElement | null = null;
  invisibleCard: HTMLElement | null = null;

  // možda nepotrebno??
  clickedElementOffsetX: number = 0;
  clickedElementOffsetY: number = 0;

  constructor(
    private readonly router: Router,
    private readonly store: Store,
    private readonly audioService: AudioService,
    private readonly hintService: HintService,
    private readonly timerService: TimerService,
    private readonly themeService: ThemeService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { difficulty: SolitaireDifficulty } | undefined;
    const value = state?.difficulty;
    this.start(value);
  }

  @HostBinding('class.light-mode')
  get lightModeClassBinding() {
    return this.themeService.lightMode();
  } 

  ngOnInit(): void {
    this.#board$ = this.store.select(selectBoard);
    this.hints = this.hintService.getHintsEmpty();

    this.#board$.pipe(
      takeUntil(this.#destroy$),
      filter(board => board !== undefined)
    ).subscribe((board) => {
      this.board = board;
      this.hints = this.hintService.getHints(board);
    });
  }

  ngAfterViewInit(): void {
    this.cardStackDragged = document.getElementById("card-stack-dragged");
    this.ghostImage = document.getElementById("ghost-image");

    document.addEventListener("mousedown", this.clickOffset);
  }

  ngOnDestroy(): void {
    document.removeEventListener("mousedown", this.clickOffset);

    this.#destroy$.next();
    this.#destroy$.complete();
  }
  
  public start(difficulty = SolitaireDifficulty.Hard): void {
    // ovde treba provera za acc ako je neka igra u toku?? inače start new bez pitanja
    // takođe difficulty pitanje da iskače prozor ili nešto
    this.resetDraggedCards();

    this.store.dispatch(solitaireActions.startNewGame({difficulty}));
  }

  public restartGame(): void {
    this.resetDraggedCards();

    this.store.dispatch(solitaireActions.restartGame());
  }

  private clickOffset = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    
    if (target) {
      const rect = target.getBoundingClientRect();
      this.clickedElementOffsetX = event.clientX - rect.left;
      this.clickedElementOffsetY = event.clientY - rect.top;
    }
  }

  private followCursor = (event: DragEvent) => {
    this.cardStackDragged!.style.left = (event.clientX - this.clickedElementOffsetX) + "px";
    this.cardStackDragged!.style.top = (event.clientY - this.clickedElementOffsetY) + "px";
  }

  public drawCards(): void {
    if (this.board === undefined) return;

    this.audioService.play_deckDraw(this.board);
    this.store.dispatch(solitaireActions.drawCards());
  }

  public showHints(): void {
    if (this.hints === undefined) return;

    this.hints.hintVisible = true;
    if (this.hints.moves.length > 0) {
      this.hints.hintIndex = (this.hints.hintIndex + 1) % this.hints.moves.length;
    }
  }

  public getFoundationBg(index: number): string {
    let bg = "url('/cards/placeholder.svg')";
    switch (index) {
      case 0:
        bg = "url('/cards/clubs_placeholder.svg')";
        break;
      case 1:
        bg = "url('/cards/diamonds_placeholder.svg')";
        break;
      case 2:
        bg = "url('/cards/hearts_placeholder.svg')";
        break;
      case 3:
        bg = "url('/cards/spades_placeholder.svg')";
        break;
      default:
        break;
    }

    return bg;
  }

  // public hideHints(): void {
  //   this.hints.hintVisible = false;
  //   this.hints.hintIndex = -1;

  //   const highlightedCardStacks = document.querySelectorAll(".highlighted-card-stack");
  //   const highlightedCards = document.querySelectorAll(".highlighted-card-single");

  //   highlightedCardStacks.forEach((el) => { el.classList.remove("highlighted-card-stack"); });
  //   highlightedCards.forEach((el) => { el.classList.remove("highlighted-card-single"); });
  // }

  // public isHighlighted(containingStack: number[], elementIndex: number): boolean {
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

  // public isHighlighted_placeholder(containingStack: number[]): boolean {
  //   if (this.hints.hintIndex < 0 || !this.hints.hintVisible) return false;
  //   if (!this.hints.moves[this.hints.hintIndex]) return false;
  
  //   let selectedHint: SolitaireMove = this.hints.moves[this.hints.hintIndex];
  
  //   // placeholder highlight
  //   return selectedHint.dest === containingStack && containingStack.length === 0;
    
  // }
  
  // public dragStart(ev: DragEvent, startArray: number[], index: number) {
  //   this.draggedCards = startArray.slice(index);
  //   this.draggedCardsStartIndex = index;
  //   this.draggedCardsOrigin = startArray;

  //   this.invisibleCard = ev.target as HTMLElement;
  //   this.invisibleCard.classList.add("hidden-card");

  //   if (this.ghostImage) ev.dataTransfer?.setDragImage(this.ghostImage, 0, 0);

  //   // this.hideHints();

  //   this.audio.play_cardPickUp();

  //   document.addEventListener('drag', this.followCursor);
  // }

  // public dragEnd() {
  //   this.audio.play_cardDropUnsuccessful();
  //   this.dragAndDropCleanUp();
  // }

  // public dropOnFoundation(cardSuit: CardSuit, dropArray: number[]): void {
  //   if (!this.board) return;
  //   if (this.draggedCardsOrigin === null || this.draggedCardsStartIndex === null) return;

  //   const lastMove = this.board!.moveNumber;

  //   this.store.dispatch(solitaireActions.dropOnFoundation({
  //     suit: cardSuit,
  //     src: this.draggedCardsOrigin,
  //     dest: dropArray,
  //     srcIndex: this.draggedCardsStartIndex
  //   }));

  //   if (this.board.moveNumber > lastMove) this.cardDroppedSuccessfuly();
  // }

  // public dropOnTableau(dropArray: number[]) {
  //   if (!this.board) return;
  //   if (this.draggedCardsOrigin === null || this.draggedCardsStartIndex === null) return;

  //   const lastMove = this.board?.moveNumber;
  //   this.store.dispatch(solitaireActions.dropOnTableau({
  //     src: this.draggedCardsOrigin,
  //     dest: dropArray,
  //     srcIndex: this.draggedCardsStartIndex
  //   }));

  //   if (this.board.moveNumber > lastMove) this.cardDroppedSuccessfuly();
  // }

  private cardDroppedSuccessfuly(): void {
    this.audioService.play_cardDropSuccessful();
    this.dragAndDropCleanUp();
  }

  private dragAndDropCleanUp(): void {
    document.removeEventListener('drag', this.followCursor);

    this.cardStackDragged!.style.visibility = "hidden";
    this.cardStackDragged!.style.left = "110vw";
    this.cardStackDragged!.style.top = "110vh";
    this.cardStackDragged!.style.visibility = "visible";

    this.invisibleCard!.classList.remove("hidden-card");
    this.invisibleCard = null;

    this.resetDraggedCards();
  }

  private resetDraggedCards(): void {
    this.draggedCards = [];
    this.draggedCardsStartIndex = null;
    this.draggedCardsOrigin = null;
  }
}

// export class SolitaireComponent1 implements AfterViewInit, OnInit, OnDestroy {
//   difficulty = SolitaireDifficulty;

//   #destroy$: Subject<void> = new Subject<void>();
//   #board$: Observable<SolitaireBoard | undefined>;
//   #cards$: Observable<Card[]>

//   board: SolitaireBoard | undefined | null;
//   cards: Card[] | undefined | null;
//   hints: SolitaireHints = { moves: [], cycleDeck: false, hintIndex: -1, hintVisible: false } as SolitaireHints;

//   draggedCards: number[] = [];
//   draggedCardsStartIndex: number | null = null;
//   draggedCardsOrigin: number[] | null = null;

//   cardStackDragged: HTMLElement | null = null;
//   ghostImage: HTMLElement | null = null;
//   invisibleCard: HTMLElement | null = null;

//   clickedElementOffsetX: number = 0;
//   clickedElementOffsetY: number = 0;

//   constructor(
//     private audio: AudioService,
//     private store: Store,
//     private helper: SolitaireHelperService,
//     private router: Router,
//     private timer: TimerService
//   ) {
//     this.#board$ = this.store.select(selectBoard);
//     this.#cards$ = this.store.select(selectCards);

//     const navigation = this.router.getCurrentNavigation();
//     const state = navigation?.extras.state as { difficulty: SolitaireDifficulty } | undefined;
//     const value = state?.difficulty;
//     this.start(value);
//   }

//   ngOnInit(): void {
//     this.#board$.pipe(takeUntil(this.#destroy$)).subscribe((board) => {
//       this.board = board;
//     });

//     this.#cards$.pipe(takeUntil(this.#destroy$)).subscribe((cards) => {
//       this.cards = cards;
//     });

//     combineLatest([this.#board$, this.#cards$])
//     .pipe(
//         takeUntil(this.#destroy$),
//         filter(([board, cards]) => !!board && !!cards)
//     )
//     .subscribe(([board, cards]) => {
//       this.hints = this.helper.getHints(board!, cards!);
//     });
//   }

//   ngAfterViewInit(): void {
//     this.cardStackDragged = document.getElementById("card-stack-dragged");
//     this.ghostImage = document.getElementById("ghost-image");

//     document.addEventListener("mousedown", this.clickOffset);
//   }

//   ngOnDestroy(): void {
//     document.removeEventListener("mousedown", this.clickOffset);

//     this.#destroy$.next();
//     this.#destroy$.complete();
//   }

//   public start(difficulty: SolitaireDifficulty = SolitaireDifficulty.Hard) {
//     // ovde treba provera za acc ako je neka igra u toku?? inače start new bez pitanja
//     // takođe difficulty pitanje da iskače prozor ili nešto

//     this.resetDraggedCards();

//     this.store.dispatch(solitaireActions.startNewGame({difficulty}));
//   }

//   public restartGame(): void {
//     // add a restart deal feature?
    
//     this.resetDraggedCards();
//     this.store.dispatch(solitaireActions.restartGame());
//   }

//   private clickOffset = (event: MouseEvent) => {
//     const target = event.target as HTMLElement;
    
//     if (target) {
//       const rect = target.getBoundingClientRect();
//       this.clickedElementOffsetX = event.clientX - rect.left;
//       this.clickedElementOffsetY = event.clientY - rect.top;
//     }
//   }

//   private followCursor = (event: DragEvent) => {
//     this.cardStackDragged!.style.left = (event.clientX - this.clickedElementOffsetX) + "px";
//     this.cardStackDragged!.style.top = (event.clientY - this.clickedElementOffsetY) + "px";
//   }

//   public drawCards(): void {
//     if (!this.board) return;
//     this.audio.play_deckDraw(this.board);
//     this.store.dispatch(solitaireActions.drawCards());
//   }

//   public showHints(): void {
//     this.hints.hintVisible = true;

//     if (this.hints.moves.length > 0) {
//       this.hints.hintIndex = (this.hints.hintIndex + 1) % this.hints.moves.length;
//     }
//   }

//   public hideHints(): void {
//     this.hints.hintVisible = false;
//     this.hints.hintIndex = -1;

//     const highlightedCardStacks = document.querySelectorAll(".highlighted-card-stack");
//     const highlightedCards = document.querySelectorAll(".highlighted-card-single");

//     highlightedCardStacks.forEach((el) => { el.classList.remove("highlighted-card-stack"); });
//     highlightedCards.forEach((el) => { el.classList.remove("highlighted-card-single"); });
//   }

//   public isHighlighted(containingStack: number[], elementIndex: number): boolean {
//     if (this.hints.hintIndex < 0 || !this.hints.hintVisible) return false;
//     if (!this.hints.moves[this.hints.hintIndex]) return false;
    
//     let selectedHint: SolitaireMove = this.hints.moves[this.hints.hintIndex];
    
//     // source highlight
//     if (selectedHint.source === containingStack && selectedHint.sourceIndex === elementIndex) return true;
    
//     // dest highlight
//     if (selectedHint.dest === containingStack && containingStack.length - 1 === elementIndex) return true;

//     return false;
//   }

//   public isHighlighted_deck(): boolean {
//     if (!this.hints.hintVisible) return false;
//     return this.hints.cycleDeck;
//   }

//   public isHighlighted_placeholder(containingStack: number[]): boolean {
//     if (this.hints.hintIndex < 0 || !this.hints.hintVisible) return false;
//     if (!this.hints.moves[this.hints.hintIndex]) return false;
  
//     let selectedHint: SolitaireMove = this.hints.moves[this.hints.hintIndex];
  
//     // placeholder highlight
//     return selectedHint.dest === containingStack && containingStack.length === 0;
    
//   }
  
//   public dragStart(ev: DragEvent, startArray: number[], index: number) {
//     this.draggedCards = startArray.slice(index);
//     this.draggedCardsStartIndex = index;
//     this.draggedCardsOrigin = startArray;

//     this.invisibleCard = ev.target as HTMLElement;
//     this.invisibleCard.classList.add("hidden-card");

//     if (this.ghostImage) ev.dataTransfer?.setDragImage(this.ghostImage, 0, 0);

//     // this.hideHints();

//     this.audio.play_cardPickUp();

//     document.addEventListener('drag', this.followCursor);
//   }

//   public dragEnd() {
//     this.audio.play_cardDropUnsuccessful();
//     this.dragAndDropCleanUp();
//   }

//   public dropOnFoundation(cardSuit: CardSuit, dropArray: number[]): void {
//     if (!this.board) return;
//     if (this.draggedCardsOrigin === null || this.draggedCardsStartIndex === null) return;

//     const lastMove = this.board!.moveNumber;

//     this.store.dispatch(solitaireActions.dropOnFoundation({
//       suit: cardSuit,
//       src: this.draggedCardsOrigin,
//       dest: dropArray,
//       srcIndex: this.draggedCardsStartIndex
//     }));

//     if (this.board.moveNumber > lastMove) this.cardDroppedSuccessfuly();
//   }

//   public dropOnTableau(dropArray: number[]) {
//     if (!this.board) return;
//     if (this.draggedCardsOrigin === null || this.draggedCardsStartIndex === null) return;

//     const lastMove = this.board?.moveNumber;
//     this.store.dispatch(solitaireActions.dropOnTableau({
//       src: this.draggedCardsOrigin,
//       dest: dropArray,
//       srcIndex: this.draggedCardsStartIndex
//     }));

//     if (this.board.moveNumber > lastMove) this.cardDroppedSuccessfuly();
//   }

//   private cardDroppedSuccessfuly(): void {
//     this.audio.play_cardDropSuccessful();

//     // game end check je broken treba ga prepraviti veoma zajebano rip
//     // this.gameEndCheck(); // zar ne treba ovo sranje da bude negde drugde a ne da komponenta za prikaz ovo računa???
//     this.dragAndDropCleanUp();
//   }

//   private dragAndDropCleanUp(): void {
//     document.removeEventListener('drag', this.followCursor);

//     this.cardStackDragged!.style.visibility = "hidden";
//     this.cardStackDragged!.style.left = "110vw";
//     this.cardStackDragged!.style.top = "110vh";
//     this.cardStackDragged!.style.visibility = "visible";

//     this.invisibleCard!.classList.remove("hidden-card");
//     this.invisibleCard = null;

//     this.resetDraggedCards();
//   }

//   private resetDraggedCards(): void {
//     this.draggedCards = [];
//     this.draggedCardsStartIndex = null;
//     this.draggedCardsOrigin = null;
//   }
// }
