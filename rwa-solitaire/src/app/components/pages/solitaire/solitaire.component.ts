import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

import { selectBoard, selectCards } from '../../../store/selectors/solitaire.selectors'
import { AudioService } from '../../../services/audio/audio.service';
import { Card, CardSuit } from "../../../models/game/card";
import { SolitaireMove } from '../../../models/game/solitaire-move';
import { SolitaireHints } from '../../../models/game/solitaire-hints';
import { SolitaireBoard, SolitaireDifficulty } from '../../../models/game/solitaire-board'; 
import { SolitaireHelperService } from '../../../services/solitaire-helper/solitaire-helper.service';
import { solitaireActions } from '../../../store/actions/solitaire.actions';
import { EntityState } from '@ngrx/entity';

@Component({
  selector: 'app-solitaire',
  templateUrl: './solitaire.component.html',
  styleUrl: './solitaire.component.scss'
})

export class SolitaireComponent implements AfterViewInit, OnDestroy {
  difficulty = SolitaireDifficulty;

  #destroy$: Subject<void> = new Subject<void>();
  
  board$: SolitaireBoard | undefined | null;
  cards$: Card[] | undefined | null;

  // hintovi na kraj treba da se izmene
  // hints: SolitaireHints = {moves: [], cycleDeck: false} as SolitaireHints;
  // hintIndex: number = -1;
  // hintVisible: boolean = false;

  // za prikaz random komponenti nema veze sa ovom komponentom. . . izmeniti nekada
  gameEndVisible: boolean = false;
  newGameConfirmationVisible: boolean = false;
  changeDiffConfirmationVisible: boolean = false;

  draggedCards: number[] = [];
  draggedCardsStartIndex: number | null = null;
  draggedCardsOrigin: number[] | null = null;

  cardStackDragged: HTMLElement | null = null;
  ghostImage: HTMLElement | null = null;
  invisibleCard: HTMLElement | null = null;

  clickedElementOffsetX: number = 0;
  clickedElementOffsetY: number = 0;

  constructor(private audio: AudioService, private store: Store) {
    //private solitaireHelper: SolitaireHelperService,

    this.store.select(selectBoard)
      .pipe(takeUntil(this.#destroy$))
      .subscribe((board) => {
        this.board$ = board;
      });

    this.store.select(selectCards)
      .pipe(takeUntil(this.#destroy$))
      .subscribe((cards) => {
        this.cards$ = cards;
      });

    this.start();
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

  public start() {
    // ovde treba provera za acc ako je neka igra u toku?? inače start new bez pitanja
    // takođe difficulty pitanje da iskače prozor ili nešto


    this.startNewGame(SolitaireDifficulty.Hard);
  }

  public startNewGame(difficulty: SolitaireDifficulty = SolitaireDifficulty.Hard) {
    this.resetDraggedCards();

    this.store.dispatch(solitaireActions.startNewGame({difficulty}));

    // this.hints = this.solitaireHelper.getHints(this.board);
    // this.hintIndex = -1;
    // this.hintVisible = false;
  }

  public restartGame(): void {
    // add a restart deal feature?
    
    this.resetDraggedCards();

    // this.hints = this.solitaireHelper.getHints(this.board);
    // this.hintIndex = -1;
    // this.hintVisible = false;

    this.store.dispatch(solitaireActions.restartGame());
  }

  public changeDifficulty(): void {
    // fali confirmation provera neka??
    // ne znam da li to ide ovde ispitati naknadno

    if (!this.board$) return;

    const newDifficulty = this.board$!.difficulty === SolitaireDifficulty.Hard
      ? SolitaireDifficulty.Easy
      : SolitaireDifficulty.Hard

    this.startNewGame(newDifficulty);
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
    //this.hideHints();

    if (!this.board$) return;
    this.audio.play_deckDraw(this.board$);
    this.store.dispatch(solitaireActions.drawCards());

    //this.hints = this.solitaireHelper.getHints(this.board);
  }

  // public showHints(): void {
  //   this.hintVisible = true;

  //   if (this.hints.moves.length > 0) {
  //     this.hintIndex = (this.hintIndex + 1) % this.hints.moves.length;
  //   }
  // }

  // public hideHints(): void {
  //   this.hintVisible = false;
  //   const highlightedCardStacks = document.querySelectorAll(".highlighted-card-stack");
  //   const highlightedCards = document.querySelectorAll(".highlighted-card-single");

  //   highlightedCardStacks.forEach((el) => { el.classList.remove("highlighted-card-stack"); });
  //   highlightedCards.forEach((el) => { el.classList.remove("highlighted-card-single"); });
  // }

  // public isHighlighted(containingStack: Card[], elementIndex: number): boolean {
  //   if (this.hintIndex < 0 || !this.hintVisible) return false;
  //   if (!this.hints.moves[this.hintIndex]) return false;
    
  //   let selectedHint: SolitaireMove = this.hints.moves[this.hintIndex];
    
  //   // source highlight
  //   if (selectedHint.source === containingStack && selectedHint.sourceIndex === elementIndex) return true;
    
  //   // dest highlight
  //   if (selectedHint.dest === containingStack && containingStack.length - 1 === elementIndex) return true;

  //   return false;
  // }

  // public isHighlighted_deck(): boolean {
  //   if (!this.hintVisible) return false;
  //   return this.hints.cycleDeck;
  // }

  // public isHighlighted_placeholder(containingStack: Card[]): boolean {
  //   if (this.hintIndex < 0 || !this.hintVisible) return false;
  //   if (!this.hints.moves[this.hintIndex]) return false;
  
  //   let selectedHint: SolitaireMove = this.hints.moves[this.hintIndex];
  
  //   // placeholder highlight
  //   return selectedHint.dest === containingStack && containingStack.length === 0;
    
  // }
  
  public dragStart(ev: DragEvent, startArray: number[], index: number) {
    this.draggedCards = startArray.slice(index);
    this.draggedCardsStartIndex = index;
    this.draggedCardsOrigin = startArray;

    this.invisibleCard = ev.target as HTMLElement;
    this.invisibleCard.classList.add("hidden-card");

    if (this.ghostImage) ev.dataTransfer?.setDragImage(this.ghostImage, 0, 0);

    // this.hideHints();

    this.audio.play_cardPickUp();

    document.addEventListener('drag', this.followCursor);
  }

  public dragEnd() {
    this.audio.play_cardDropUnsuccessful();
    this.dragAndDropCleanUp();
  }

  public dropOnFoundation(cardSuit: CardSuit, dropArray: number[]): void {
    if (!this.board$) return;
    if (this.draggedCardsOrigin === null || this.draggedCardsStartIndex === null) return;

    const initialValue = this.board$?.moveNumber;
    this.store.dispatch(solitaireActions.dropOnFoundation({
      suit: cardSuit,
      src: this.draggedCardsOrigin,
      dest: dropArray,
      srcIndex: this.draggedCardsStartIndex
    }));

    if (this.board$.moveNumber > initialValue) this.cardDroppedSuccessfuly();
  }

  public dropOnTableau(dropArray: number[]) {
    if (!this.board$) return;
    if (this.draggedCardsOrigin === null || this.draggedCardsStartIndex === null) return;

    const initialValue = this.board$?.moveNumber;
    this.store.dispatch(solitaireActions.dropOnTableau({
      src: this.draggedCardsOrigin,
      dest: dropArray,
      srcIndex: this.draggedCardsStartIndex
    }));

    if (this.board$.moveNumber > initialValue) this.cardDroppedSuccessfuly();
  }

  private cardDroppedSuccessfuly(): void {
    this.audio.play_cardDropSuccessful();

    // game end check je broken treba ga prepraviti veoma zajebano rip
    // this.gameEndCheck(); // zar ne treba ovo sranje da bude negde drugde a ne da komponenta za prikaz ovo računa???
    // this.getNewHints();
    this.dragAndDropCleanUp();
  }

  // private getNewHints(): void {
  //   this.hints = this.solitaireHelper.getHints(this.board);
  //   this.hintIndex = -1;
  // }

  // private gameEndCheck() {
  //   this.gameEndVisible = this.solitaireHelper.lookForGameEndCondition(this.board);
  //   if (this.gameEndVisible) this.audio.play_levelComplete();
  // }

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

  // ostalo je potrebno preneti u bottom bar komponentu i koristiti store za pozivanje prozora i čega već

  public pressed_newGameButton(): void {
    this.audio.play_buttonPress();
    this.newGameConfirmationVisible = true;
  }

  public pressed_changeDifficultyButton(): void {
    this.audio.play_buttonPress();
    this.changeDiffConfirmationVisible = true;
  }

  public pressed_showHintButton(): void {
    this.audio.play_buttonPress();
    // this.showHints();
  }

  public pressed_showFakeGameEndButton(): void {
    this.audio.play_buttonPress();
    this.gameEndVisible = true;
  }

  public loggg(): void {
    // console.log("--LOG-- Move number: " + board?.moveNumber);
    console.log("----------");
    console.log(this.cards$);
    console.log(this.board$);
    console.log("----------");

  }

}
