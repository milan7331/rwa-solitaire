import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { Card, CardSuit } from "../../../models/game/card";
import { SolitaireBoard } from '../../../models/game/solitaire-board'; 
import { SolitaireHelperService } from '../../../services/solitaire-helper/solitaire-helper.service';
import { SolitaireMove } from '../../../models/game/solitaire-move';
import { SolitaireHints } from '../../../models/game/solitaire-hints';
import { AudioService } from '../../../services/audio/audio.service';

@Component({
  selector: 'app-solitaire',
  templateUrl: './solitaire.component.html',
  styleUrl: './solitaire.component.scss'
})

export class SolitaireComponent implements AfterViewInit, OnDestroy {
  public CardSuit = CardSuit;
  
  private solitaireHelper: SolitaireHelperService;
  private audio: AudioService;
  
  board: SolitaireBoard;
  
  hints: SolitaireHints = {moves: [], cycleDeck: false} as SolitaireHints;
  hintIndex: number = -1;
  hintVisible: boolean = false;

  gameEndVisible: boolean = false;

  draggedCards: Card[] = [];
  draggedCardsStartIndex: number | null = null;
  draggedCardsOrigin: Card[] | null = null;

  cardStackDragged: HTMLElement | null = null;
  ghostImage: HTMLElement | null = null;
  invisibleCard: HTMLElement | null = null;

  clickedElementOffsetX: number = 0;
  clickedElementOffsetY: number = 0;

  constructor() {
    this.board = new SolitaireBoard();
    this.solitaireHelper = inject(SolitaireHelperService);
    this.audio = inject(AudioService);
    this.startNewGame();
    
  }

  ngAfterViewInit(): void {
    this.cardStackDragged = document.getElementById("card-stack-dragged");
    this.ghostImage = document.getElementById("ghost-image");

    document.addEventListener("mousedown", this.clickOffset);
  }

  ngOnDestroy(): void {
    document.removeEventListener("mousedown", this.clickOffset);
  }

  public startNewGame() {
    this.draggedCards = [];
    this.draggedCardsStartIndex = null;
    this.draggedCardsOrigin = null;

    this.board.startNewGame();

    this.hints = this.solitaireHelper.getHints(this.board);
    this.hintIndex = -1;
    this.hintVisible = false;
  }

  public resetBoard(): void {
    // add a restart deal feature?
  }

  public changeDifficulty(): void {
    this.board.toggleDifficulty();
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

  public boardDrawCards(): void {
    this.hideHints();
    this.audio.play_deckDraw(this.board);
    this.board.drawCards();
    this.hints = this.solitaireHelper.getHints(this.board);
  }

  public showHints(): void {
    this.hintVisible = true;

    if (this.hints.moves.length > 0) {
      this.hintIndex = (this.hintIndex + 1) % this.hints.moves.length;
    }
  }

  public hideHints(): void {
    this.hintVisible = false;
    const highlightedCardStacks = document.querySelectorAll(".highlighted-card-stack");
    const highlightedCards = document.querySelectorAll(".highlighted-card-single");

    highlightedCardStacks.forEach((el) => { el.classList.remove("highlighted-card-stack"); });
    highlightedCards.forEach((el) => { el.classList.remove("highlighted-card-single"); });
  }

  public isHighlighted(containingStack: Card[], elementIndex: number): boolean {
    if (this.hintIndex < 0 || !this.hintVisible) return false;
    if (!this.hints.moves[this.hintIndex]) return false;
    
    let selectedHint: SolitaireMove = this.hints.moves[this.hintIndex];
    
    // source highlight
    if (selectedHint.source === containingStack && selectedHint.sourceIndex === elementIndex) return true;
    
    // dest highlight
    if (selectedHint.dest === containingStack && containingStack.length - 1 === elementIndex) return true;

    return false;
  }

  public isHighlighted_deck(): boolean {
    if (!this.hintVisible) return false;
    return this.hints.cycleDeck;
  }

  public isHighlighted_placeholder(containingStack: Card[]): boolean {
    if (this.hintIndex < 0 || !this.hintVisible) return false;
    if (!this.hints.moves[this.hintIndex]) return false;
  
    let selectedHint: SolitaireMove = this.hints.moves[this.hintIndex];
  
    // placeholder highlight
    return selectedHint.dest === containingStack && containingStack.length === 0;
    
  }
  
  public dragStart(ev: DragEvent, startArray: Card[], index: number) {
    this.draggedCards = startArray.slice(index);
    this.draggedCardsStartIndex = index;
    this.draggedCardsOrigin = startArray;

    this.invisibleCard = ev.target as HTMLElement;
    this.invisibleCard.classList.add("hidden-card");

    if(this.ghostImage) ev.dataTransfer?.setDragImage(this.ghostImage, 0, 0);

    this.hideHints();

    this.audio.play_cardPickUp();

    document.addEventListener('drag', this.followCursor);
  }

  public dragEnd() {
    this.audio.play_cardDropUnsuccessful();
    this.dragAndDropCleanUp();
  }

  public dropOnFoundation(cardSuit: CardSuit, dropArray: Card[]): void {
    const dropSucess = this.board.dropOnFoundation(this.draggedCardsOrigin, dropArray, this.draggedCardsStartIndex ,cardSuit);
    if (dropSucess) this.cardDroppedSuccessfuly();

  }

  public dropOnTableau(dropArray: Card[]) {
    const dropSucess = this.board.dropOnTableau(this.draggedCardsOrigin, dropArray, this.draggedCardsStartIndex);
    if (dropSucess) this.cardDroppedSuccessfuly();

  }

  private cardDroppedSuccessfuly(): void {
    this.audio.play_cardDropSuccessful();
    this.gameEndCheck();
    this.getNewHints();
    this.dragAndDropCleanUp();
  }

  private getNewHints(): void {
    this.hints = this.solitaireHelper.getHints(this.board);
    this.hintIndex = -1;
  }

  private gameEndCheck() {
    this.gameEndVisible = this.solitaireHelper.lookForGameEndCondition(this.board);
    if (this.gameEndVisible) this.audio.play_levelComplete();
  }

  private dragAndDropCleanUp(): void {
    document.removeEventListener('drag', this.followCursor);

    this.cardStackDragged!.style.visibility = "hidden";
    this.cardStackDragged!.style.left = "110vw";
    this.cardStackDragged!.style.top = "110vh";
    this.cardStackDragged!.style.visibility = "visible";

    this.invisibleCard!.classList.remove("hidden-card");
    this.invisibleCard = null;

    this.draggedCards = [];
    this.draggedCardsStartIndex = null;
    this.draggedCardsOrigin = null;
  }

  public fakeGameEnd() {
    this.gameEndVisible = true;
  }

  public handleButtonPress(cb: Function): void {
    this.audio.play_buttonPress();
    cb();
  }

}
