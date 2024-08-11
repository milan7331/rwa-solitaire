import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Card, CardFace, CardNumber, CardSuit } from '../../models/card';
import { KlondikeBoard, KlondikeDifficulty } from '../../models/klondike-board'; 

@Component({
  selector: 'app-klondike',
  templateUrl: './klondike.component.html',
  styleUrl: './klondike.component.scss'
})

export class KlondikeComponent implements AfterViewInit, OnDestroy {

  board: KlondikeBoard;

  draggedCards: Card[] = [];
  draggedCardsOrigin: Card[] | null = null;

  cardStackDragged: HTMLElement | null = null;
  ghostImage: HTMLElement | null = null;

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

  followCursor = (event: DragEvent) => {
    this.cardStackDragged!.style.left = (event.clientX - this.clickedElementOffsetX) + "px";
    this.cardStackDragged!.style.top = (event.clientY - this.clickedElementOffsetY) + "px";
  }

  clickOffset = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (target) {
      const rect = target.getBoundingClientRect();
      this.clickedElementOffsetX = event.clientX - rect.left;
      this.clickedElementOffsetY = event.clientY - rect.top;
    }
  }

  dragStart(ev: DragEvent, startArray: Card[], index: number) {
    this.draggedCards = startArray.slice(index);
    this.draggedCardsOrigin = startArray;

    if(this.ghostImage != null) {
      ev.dataTransfer?.setDragImage(this.ghostImage, 0, 0);
    }

    document.addEventListener('drag', this.followCursor);
  }

  dragEnd() {
    document.removeEventListener('drag', this.followCursor);
    this.cardStackDragged!.style.top = "110vh";
    
    this.draggedCards = [];
    this.draggedCardsOrigin = null;


  }

  drop(dropArray: Card[]) {
    if (this.draggedCards.length > 0 && this.draggedCardsOrigin != null) {
      for(let card of this.draggedCards) {
        dropArray.push(card);
      }
      let origin_count = this.draggedCardsOrigin.length;
      let draged_count = this.draggedCards.length;

      this.draggedCardsOrigin.splice(origin_count - draged_count, draged_count);
    }

    this.dragEnd();
  }
}
