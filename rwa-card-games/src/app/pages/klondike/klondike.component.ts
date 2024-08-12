import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Card, CardNumber, CardSuit } from '../../models/card';
import { KlondikeBoard, KlondikeDifficulty } from '../../models/klondike-board'; 

@Component({
  selector: 'app-klondike',
  templateUrl: './klondike.component.html',
  styleUrl: './klondike.component.scss'
})

export class KlondikeComponent implements AfterViewInit, OnDestroy {

  public CardSuit = CardSuit;
  board: KlondikeBoard;

  draggedCards: Card[] = [];
  draggedCardsOrigin: Card[] | null = null;

  cardStackDragged: HTMLElement | null = null;
  ghostImage: HTMLElement | null = null;
  invisibleCard: HTMLElement | null = null;

  clickedElementOffsetX: number = 0;
  clickedElementOffsetY: number = 0;

  constructor() {
    this.board = new KlondikeBoard();
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
    this.resetBoard();
    this.board.generateDeck();
    this.board.fisherYatesShuffle();
    this.board.placeInitialCards();
    this.board.setUpInitialCardOrientations();
  }

  resetBoard(): void {
    this.board.clearBoard();

    this.draggedCards = [];
    this.draggedCardsOrigin = null;
  }

  changeDifficulty(): void {
    this.board.toggleDifficulty();
    this.startNewGame();
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
  
  dragStart(ev: DragEvent, startArray: Card[], index: number) {
    this.draggedCards = startArray.slice(index);
    this.draggedCardsOrigin = startArray;

    this.invisibleCard = ev.target as HTMLElement;
    this.invisibleCard.classList.add("hidden-card");

    if(this.ghostImage) ev.dataTransfer?.setDragImage(this.ghostImage, 0, 0);

    document.addEventListener('drag', this.followCursor);
  }

  dragEnd() {
    document.removeEventListener('drag', this.followCursor);

    this.cardStackDragged!.style.visibility = "hidden";
    this.cardStackDragged!.style.left = "110vw";
    this.cardStackDragged!.style.top = "110vh";
    this.cardStackDragged!.style.visibility = "visible";

    this.invisibleCard!.classList.remove("hidden-card");
    this.invisibleCard = null;


    this.draggedCards = [];
    this.draggedCardsOrigin = null;
  }

  drop(dropArray: Card[]): void {
    for(let card of this.draggedCards) {
      dropArray.push(card);
    }
    let origin_count = this.draggedCardsOrigin!.length;
    let draged_count = this.draggedCards.length;

    this.draggedCardsOrigin!.splice(origin_count - draged_count, draged_count);
    
    if (this.draggedCardsOrigin?.length !== 0) {
      this.draggedCardsOrigin![this.draggedCardsOrigin!.length - 1].faceShown = true;
      this.draggedCardsOrigin![this.draggedCardsOrigin!.length - 1].unlock();
    }
  }

  dropOnFoundation(cardSuit: CardSuit, dropArray: Card[]): void {
    if (this.draggedCards.length <= 0 || this.draggedCardsOrigin == null) {
      this.dragEnd();
      return;
    }
  
    const isSingleCardDragged = this.draggedCards.length === 1;
    const isCorrectSuit = this.draggedCards[0].suit === cardSuit;
    let isCorrectCard: boolean = false;
    if (dropArray.length === 0) {
      isCorrectCard = this.draggedCards[0].number === CardNumber.Ace;
    } else {
      isCorrectCard = this.draggedCards[0].number - dropArray[dropArray.length - 1].number === 1;
    }
    
    if (isSingleCardDragged && isCorrectSuit && isCorrectCard) {
      this.drop(dropArray);
    }
    this.dragEnd();
  }

  dropOnTableau(dropArray: Card[]) {
    if (this.draggedCards.length <= 0 || this.draggedCardsOrigin == null) {
      this.dragEnd();
      return;
    }

    let isCorrectSuit: boolean = false;
    let isCorrectCard: boolean = false;

    if (dropArray.length === 0) {
      isCorrectSuit = true;
      isCorrectCard = this.draggedCards[0].number === CardNumber.King;
    } else {
      isCorrectSuit = this.draggedCards[0].color != dropArray[dropArray.length - 1].color;
      isCorrectCard = dropArray[dropArray.length - 1].number - this.draggedCards[0].number === 1;
    }

    if (isCorrectSuit && isCorrectCard) {
      this.drop(dropArray);
    }
    this.dragEnd();
  }
}
