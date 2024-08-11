import { Card, CardFace, CardNumber, CardSuit } from "./card";

export enum KlondikeDifficulty {
    Easy = 0,
    Hard = 1
}

export class KlondikeBoard {

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

    difficulty: KlondikeDifficulty = 1;

    constructor() {
        this.clearBoard();
    }


    clearBoard(): void {
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
    }

    generateDeck(): void {
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

    fisherYatesShuffle(): void {
        for (let i = this.deckStock.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deckStock[i], this.deckStock[j]] = [this.deckStock[j], this.deckStock[i]];
        }
    }

    placeInitialCards() : void {
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

    setUpInitialCardOrientations() {
        this.tableau1.at(-1)!.flip();
        this.tableau2.at(-1)!.flip();
        this.tableau3.at(-1)!.flip();
        this.tableau4.at(-1)!.flip();
        this.tableau5.at(-1)!.flip();
        this.tableau6.at(-1)!.flip();
        this.tableau7.at(-1)!.flip();

        this.tableau1.at(-1)!.unlock();
        this.tableau2.at(-1)!.unlock();
        this.tableau3.at(-1)!.unlock();
        this.tableau4.at(-1)!.unlock();
        this.tableau5.at(-1)!.unlock();
        this.tableau6.at(-1)!.unlock();
        this.tableau7.at(-1)!.unlock();

        for (let i = 0; i < this.deckStock.length; i++) {
            this.deckStock[i].unlock();
            this.deckStock[i].flip();
        }
    }

    toggleDifficulty(): void {
        (this.difficulty === KlondikeDifficulty.Easy)? this.difficulty = KlondikeDifficulty.Hard : this.difficulty = KlondikeDifficulty.Easy;
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


    
    
}