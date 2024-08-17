import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Card, CardNumber, CardSuit } from '../../models/card';
import { KlondikeBoard } from '../../models/klondike-board'; 

@Component({
  selector: 'app-klondike',
  templateUrl: './klondike.component.html',
  styleUrl: './klondike.component.scss'
})

export class KlondikeComponent implements AfterViewInit, OnDestroy {

  public CardSuit = CardSuit;

  board: KlondikeBoard;

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
  }

  resetBoard(): void {

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
  
  dragStart(ev: DragEvent, startArray: Card[], index: number) {
    this.draggedCards = startArray.slice(index);
    this.draggedCardsStartIndex = index;
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
    this.draggedCardsStartIndex = null;
    this.draggedCardsOrigin = null;
  }

  dropOnFoundation(cardSuit: CardSuit, dropArray: Card[]): void {
    const dropSucess = this.board.dropOnFoundation(this.draggedCardsOrigin, dropArray, this.draggedCardsStartIndex ,cardSuit);
    if (dropSucess) {
      this.dragEnd();
    }
    else {
      console.log("dropOnFoundation Error - Klondike component");
    }
  }

  dropOnTableau(dropArray: Card[]) {
    const dropSucess = this.board.dropOnTableau(this.draggedCardsOrigin, dropArray, this.draggedCardsStartIndex);
    if (dropSucess) {
      this.dragEnd();
    } else {
      console.log("dropOnTableau Error - Klondike component");
    }
  }
}
