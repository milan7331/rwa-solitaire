import { Component } from '@angular/core';
import { Card, CardFace, CardNumber, CardSuit } from '../../models/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-klondike',
  templateUrl: './klondike.component.html',
  styleUrl: './klondike.component.scss'
})
export class KlondikeComponent {
  
  foundationClubs: Card[];
  foundationDiamonds: Card[];
  foundationHearts: Card[];
  foundationSpades: Card[];

  deckStock: Card[];
  deckWaste: Card[];

  tableau1: Card[];
  tableau2: Card[];
  tableau3: Card[];
  tableau4: Card[];
  tableau5: Card[];
  tableau6: Card[];
  tableau7: Card[];

  tableau1_movable: number = 1;
  tableau2_movable: number = 1;
  tableau3_movable: number = 1;
  tableau4_movable: number = 1;
  tableau5_movable: number = 1;
  tableau6_movable: number = 1;
  tableau7_movable: number = 1;

  draggedCard: Card | null;
  draggedStartLocation: Card[] | null;

  constructor(private router: Router) {
    this.foundationClubs = [];
    this.foundationDiamonds = [];
    this.foundationHearts = [];
    this.foundationSpades = [];

    this.deckStock = [];
    this.deckWaste = [];

    this.tableau1 = [];
    this.tableau2 = [];
    this.tableau3 = [];
    this.tableau4 = [];
    this.tableau5 = [];
    this.tableau6 = [];
    this.tableau7 = [];

    this.draggedCard = null;
    this.draggedStartLocation = null;

    this.loadCardsDemo();
    
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

  loadCardsDemo() {
    this.tableau2.push(new Card(CardSuit.SPADES, CardNumber.Ace));

    this.tableau3.push(new Card(CardSuit.SPADES, CardNumber.Two));
    this.tableau3.push(new Card(CardSuit.DIAMONDS, CardNumber.Two));
    
    this.tableau4.push(new Card(CardSuit.CLUBS, CardNumber.Three));
    this.tableau4.push(new Card(CardSuit.HEARTS, CardNumber.Three));
    this.tableau4.push(new Card(CardSuit.HEARTS, CardNumber.Three));

    this.tableau5.push(new Card(CardSuit.SPADES, CardNumber.Four));
    this.tableau5.push(new Card(CardSuit.CLUBS, CardNumber.Four));
    this.tableau5.push(new Card(CardSuit.HEARTS, CardNumber.Four));
    this.tableau5.push(new Card(CardSuit.DIAMONDS, CardNumber.Four));

    this.tableau6.push(new Card(CardSuit.CLUBS, CardNumber.Five));
    this.tableau6.push(new Card(CardSuit.SPADES, CardNumber.Five));
    this.tableau6.push(new Card(CardSuit.HEARTS, CardNumber.Five));
    this.tableau6.push(new Card(CardSuit.DIAMONDS, CardNumber.Five));
    this.tableau6.push(new Card(CardSuit.DIAMONDS, CardNumber.Six));

    this.tableau7.push(new Card(CardSuit.SPADES, CardNumber.Six));
    this.tableau7.push(new Card(CardSuit.CLUBS, CardNumber.Six));
    this.tableau7.push(new Card(CardSuit.HEARTS, CardNumber.Six));
    this.tableau7.push(new Card(CardSuit.DIAMONDS, CardNumber.Seven));
    this.tableau7.push(new Card(CardSuit.HEARTS, CardNumber.Seven));
    this.tableau7.push(new Card(CardSuit.SPADES, CardNumber.Seven));

  }
  
}
