import { Component } from '@angular/core';
import { Card, CardFace, CardNumber, CardSuit, KlondikeDifficulty } from '../../models/card';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-klondike',
  templateUrl: './klondike.component.html',
  styleUrl: './klondike.component.scss'
})

export class KlondikeComponent {
  
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

  tableau1_movable: number = 1;
  tableau2_movable: number = 1;
  tableau3_movable: number = 1;
  tableau4_movable: number = 1;
  tableau5_movable: number = 1;
  tableau6_movable: number = 1;
  tableau7_movable: number = 1;

  draggedCard: Card | null = null;
  draggedStartLocation: Card[] | null = null;

  difficulty: KlondikeDifficulty = 1;

  constructor() {
    this.startNewGameDemo();
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

  dragStart(card: Card, startArray: Card[]) {
    this.draggedCard = card;
    this.draggedStartLocation = startArray;
  }

  dragEnd() {
    this.draggedCard = null;
    this.draggedStartLocation = null;
  }

  drop(dropArray: Card[]) {
    if (this.draggedCard, this.draggedStartLocation) {
      dropArray.push(this.draggedCard!);
      let elementId = this.draggedStartLocation.indexOf(this.draggedCard!);
      if (elementId > -1) {
        this.draggedStartLocation.splice(elementId, 1);
      }
    }
  }
}
