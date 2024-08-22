import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { Card } from '../../models/card';
import { CardColor, CardNumber, CardSuit } from '../../models/card.enums';
import { KlondikeBoard } from '../../models/klondike-board'; 
import { KlondikeHelperService } from '../../services/klondike-helper/klondike-helper.service';
import { KlondikeMove } from '../../models/klondike-move';
import { KlondikeHint } from '../../models/klondike-hint';

@Component({
  selector: 'app-klondike',
  templateUrl: './klondike.component.html',
  styleUrl: './klondike.component.scss'
})

export class KlondikeComponent implements AfterViewInit, OnDestroy {
  public CardSuit = CardSuit;
  
  private helper: KlondikeHelperService;
  
  board: KlondikeBoard;
  
  hints: KlondikeHint = {moves: [], cycleDeck: false} as KlondikeHint;
  hintIndex: number = -1;
  hintVisible: boolean = false;

  draggedCards: Card[] = [];
  draggedCardsStartIndex: number | null = null;
  draggedCardsOrigin: Card[] | null = null;

  cardStackDragged: HTMLElement | null = null;
  ghostImage: HTMLElement | null = null;
  invisibleCard: HTMLElement | null = null;

  clickedElementOffsetX: number = 0;
  clickedElementOffsetY: number = 0;

  constructor() {
    this.board = new KlondikeBoard();
    this.helper = inject(KlondikeHelperService);
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

  startNewGame() {
    this.draggedCards = [];
    this.draggedCardsStartIndex = null;
    this.draggedCardsOrigin = null;

    this.board.startNewGame();

    this.hints = this.helper.getHint(this.board);
    this.hintIndex = -1;
    this.hintVisible = false;
  }

  resetBoard(): void {
    // add a restart deal feature?
  }

  changeDifficulty(): void {
    this.board.toggleDifficulty();
  }

  clickOffset = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    
    if (target) {
      const rect = target.getBoundingClientRect();
      this.clickedElementOffsetX = event.clientX - rect.left;
      this.clickedElementOffsetY = event.clientY - rect.top;
    }
  }

  followCursor = (event: DragEvent) => {
    this.cardStackDragged!.style.left = (event.clientX - this.clickedElementOffsetX) + "px";
    this.cardStackDragged!.style.top = (event.clientY - this.clickedElementOffsetY) + "px";
  }

  boardDraw(): void {
    this.hideHints();
    this.board.draw();
    this.hints = this.helper.getHint(this.board);
  }

  showHints(): void {
    this.hintVisible = true;

    if(this.hints.moves.length < 1) {

    } else {
      this.hintIndex = (this.hintIndex + 1) % this.hints.moves.length;
      console.log(this.hints.moves.length + "||" + this.hintVisible + "||" + this.hintIndex + "||" + this.hints.cycleDeck);
    }
  }

  
  hideHints(): void {
    this.hintVisible = false;
    const highlightedCardStacks = document.querySelectorAll(".highlighted-card-stack");
    const highlightedCards = document.querySelectorAll(".highlighted-card-single");

    highlightedCardStacks.forEach((el) => { el.classList.remove("highlighted-card-stack"); });
    highlightedCards.forEach((el) => { el.classList.remove("highlighted-card-single"); });
  }

  isHighlighted(containingStack: Card[], elementIndex: number): boolean {
    if (this.hintIndex < 0 || !this.hintVisible) return false;
    if (!this.hints.moves[this.hintIndex]) return false;
    
    let selectedHint: KlondikeMove = this.hints.moves[this.hintIndex];
    
    // source highlight
    if (selectedHint.source === containingStack && selectedHint.sourceIndex === elementIndex) return true;
    
    // dest highlight
    if (selectedHint.dest === containingStack && containingStack.length - 1 === elementIndex) return true;

    return false;
  }

  isHighlighted_deck(): boolean {
    if (!this.hintVisible) return false;
    return this.hints.cycleDeck;
  }



  isHighlighted_placeholder(containingStack: Card[]): boolean {
    if (this.hintIndex < 0 || !this.hintVisible) return false;
    if (!this.hints.moves[this.hintIndex]) return false;
  
    let selectedHint: KlondikeMove = this.hints.moves[this.hintIndex];
  
    // placeholder highlight
    return selectedHint.dest === containingStack && containingStack.length === 0;
    
  }
  
  dragStart(ev: DragEvent, startArray: Card[], index: number) {
    this.draggedCards = startArray.slice(index);
    this.draggedCardsStartIndex = index;
    this.draggedCardsOrigin = startArray;

    this.invisibleCard = ev.target as HTMLElement;
    this.invisibleCard.classList.add("hidden-card");

    if(this.ghostImage) ev.dataTransfer?.setDragImage(this.ghostImage, 0, 0);

    this.hideHints();

    document.addEventListener('drag', this.followCursor);
  }

  dragEnd() {
    this.dragAndDropCleanUp();
  }

  dropOnFoundation(cardSuit: CardSuit, dropArray: Card[]): void {
    const dropSucess = this.board.dropOnFoundation(this.draggedCardsOrigin, dropArray, this.draggedCardsStartIndex ,cardSuit);
    if (dropSucess) {
      this.hints = this.helper.getHint(this.board);
      this.hintIndex = -1;
      
      this.dragAndDropCleanUp();
    }

  }

  dropOnTableau(dropArray: Card[]) {
    const dropSucess = this.board.dropOnTableau(this.draggedCardsOrigin, dropArray, this.draggedCardsStartIndex);
    if (dropSucess) {
      this.hints = this.helper.getHint(this.board);
      this.hintIndex = -1;
      
      this.dragAndDropCleanUp();
    }

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


  printCurrentHints(): void {
    console.log("Hint index: " + this.hintIndex);
    console.log("------------------------");
    for (const hint of this.hints.moves) {
      console.log(hint.source.length + "::" + hint.dest.length + "::" + hint.sourceIndex);
    }
    console.log("------------------------");
  }
}
