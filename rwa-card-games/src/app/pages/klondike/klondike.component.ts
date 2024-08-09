import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Card, CardFace, CardNumber, CardSuit, KlondikeDifficulty } from '../../models/card';

@Component({
  selector: 'app-klondike',
  templateUrl: './klondike.component.html',
  styleUrl: './klondike.component.scss'
})

export class KlondikeComponent implements AfterViewInit, OnDestroy {

  foundationClubs: Card[] = [];
  foundationDiamonds: Card[] = [];
  foundationHearts: Card[] = [];
  foundationSpades: Card[] = [];

  deckStock: Card[] = [];
  deckWaste: Card[] = [];

  tableau1: Card[] = [];
  tableau2: Card[] = [];
  tableau3: Card[] = [];
  tableau4: Card[] = [];
  tableau5: Card[] = [];
  tableau6: Card[] = [];
  tableau7: Card[] = [];

  draggedCards: Card[] = [];
  draggedCardsOrigin: Card[] | null = null;
  dropped: boolean = false;

  tableau1_movable: number = 1;
  tableau2_movable: number = 1;
  tableau3_movable: number = 1;
  tableau4_movable: number = 1;
  tableau5_movable: number = 1;
  tableau6_movable: number = 1;
  tableau7_movable: number = 1;

  difficulty: KlondikeDifficulty = 1;

  cardStackDragged: HTMLElement | null = null;
  ghostImage: HTMLElement | null = null;

  clickedElementOffsetX: number = 0;
  clickedElementOffsetY: number = 0;

  constructor() {
    this.startNewGameDemo();
  }

  ngAfterViewInit(): void {
    this.cardStackDragged = document.getElementById("card-stack-dragged");
    this.ghostImage = document.getElementById("ghost-image");

    document.addEventListener("mousedown", this.clickOffset);
  }

  ngOnDestroy(): void {
    document.removeEventListener("mousedown", this.clickOffset);
  }

  startNewGameDemo() {
    this.clearBoardDemo();
    this.fillDeckDemo();
    this.fisherYatesShuffleDemo(this.deckStock);
    this.placeTableauCardsDemo();
  }

  clearBoardDemo(): void {
    this.deckStock = [];
    this.deckWaste = [];

    this.tableau1 = [];
    this.tableau2 = [];
    this.tableau3 = [];
    this.tableau4 = [];
    this.tableau5 = [];
    this.tableau6 = [];
    this.tableau7 = [];

    this.foundationClubs = [];
    this.foundationDiamonds = [];
    this.foundationHearts = [];
    this.foundationSpades = [];

    this.tableau1_movable = 0;
    this.tableau2_movable = 0;
    this.tableau3_movable = 0;
    this.tableau4_movable = 0;
    this.tableau5_movable = 0;
    this.tableau6_movable = 0;
    this.tableau7_movable = 0;

    this.draggedCards = [];
    this.draggedCardsOrigin = null;

    this.cardStackDragged = null;
    this.ghostImage = null;

    this.clickedElementOffsetX = 0;
    this.clickedElementOffsetY = 0;
  }

  fillDeckDemo(): void {
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.Ace));
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.Two));
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.Three));
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.Four));
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.Five));
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.Six));
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.Seven));
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.Eight));
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.Nine));
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.Ten));
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.Jack));
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.Queen));
    this.deckStock.push(new Card(CardSuit.CLUBS, CardNumber.King));

    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.Ace));
    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.Two));
    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.Three));
    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.Four));
    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.Five));
    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.Six));
    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.Seven));
    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.Eight));
    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.Nine));
    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.Ten));
    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.Jack));
    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.Queen));
    this.deckStock.push(new Card(CardSuit.DIAMONDS, CardNumber.King));

    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.Ace));
    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.Two));
    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.Three));
    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.Four));
    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.Five));
    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.Six));
    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.Seven));
    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.Eight));
    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.Nine));
    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.Ten));
    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.Jack));
    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.Queen));
    this.deckStock.push(new Card(CardSuit.HEARTS, CardNumber.King));

    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.Ace));
    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.Two));
    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.Three));
    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.Four));
    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.Five));
    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.Six));
    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.Seven));
    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.Eight));
    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.Nine));
    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.Ten));
    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.Jack));
    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.Queen));
    this.deckStock.push(new Card(CardSuit.SPADES, CardNumber.King));
  }

  placeTableauCardsDemo(): void {
    this.tableau1.push(this.deckStock.pop()!);
    
    this.tableau2.push(this.deckStock.pop()!);
    this.tableau2.push(this.deckStock.pop()!);

    this.tableau3.push(this.deckStock.pop()!);
    this.tableau3.push(this.deckStock.pop()!);
    this.tableau3.push(this.deckStock.pop()!);
    
    this.tableau4.push(this.deckStock.pop()!);
    this.tableau4.push(this.deckStock.pop()!);
    this.tableau4.push(this.deckStock.pop()!);
    this.tableau4.push(this.deckStock.pop()!);

    this.tableau5.push(this.deckStock.pop()!);
    this.tableau5.push(this.deckStock.pop()!);
    this.tableau5.push(this.deckStock.pop()!);
    this.tableau5.push(this.deckStock.pop()!);
    this.tableau5.push(this.deckStock.pop()!);

    this.tableau6.push(this.deckStock.pop()!);
    this.tableau6.push(this.deckStock.pop()!);
    this.tableau6.push(this.deckStock.pop()!);
    this.tableau6.push(this.deckStock.pop()!);
    this.tableau6.push(this.deckStock.pop()!);
    this.tableau6.push(this.deckStock.pop()!);

    this.tableau7.push(this.deckStock.pop()!);
    this.tableau7.push(this.deckStock.pop()!);
    this.tableau7.push(this.deckStock.pop()!);
    this.tableau7.push(this.deckStock.pop()!);
    this.tableau7.push(this.deckStock.pop()!);
    this.tableau7.push(this.deckStock.pop()!);
    this.tableau7.push(this.deckStock.pop()!);
  }

  fisherYatesShuffleDemo(deck: Card[]): void {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  draw(): void {
    if (this.difficulty === KlondikeDifficulty.Hard) {
      if (this.deckStock.length > 0) this.deckWaste.push(this.deckStock.pop()!);
      if (this.deckStock.length > 0) this.deckWaste.push(this.deckStock.pop()!);
      if (this.deckStock.length > 0) this.deckWaste.push(this.deckStock.pop()!);
    } else {
      if (this.deckStock.length > 0) this.deckWaste.push(this.deckStock.pop()!);
    }
  }

  changeDifficulty(): void {
    (this.difficulty === KlondikeDifficulty.Easy)? this.difficulty = KlondikeDifficulty.Hard : this.difficulty = KlondikeDifficulty.Easy;
    this.startNewGameDemo();
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
