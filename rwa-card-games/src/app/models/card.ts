export enum CardSuit {
    Clubs = 0,
    Diamonds = 1,
    Hearts = 2,
    Spades = 3
}

export enum CardColor {
    Red = 1,
    Black = 2
}

export enum CardNumber {
    Ace = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13
}

const SuitDictionary: {[key in CardSuit]: string} = {
    [CardSuit.Clubs]: "clubs",
    [CardSuit.Diamonds]: "diamonds",
    [CardSuit.Hearts]: "hearts",
    [CardSuit.Spades]: "spades"
}

export class Card {
    suit: CardSuit;
    number: CardNumber;
    color: CardColor;
    faceShown: boolean;
    visibility: boolean;
    movable: boolean;
    picture: string;

    constructor(suit: CardSuit, number: CardNumber)
    {
        this.suit = suit;
        this.number = number;
        this.color = (suit == CardSuit.Diamonds || suit == CardSuit.Hearts)? CardColor.Red : CardColor.Black;
        this.faceShown = false;
        this.visibility = true;
        this.movable = false;
        this.picture = this.setPicture(suit, number);
    }

    private setPicture(suit: CardSuit, number: CardNumber): string {
        return SuitDictionary[suit] + "_" + number;
    }

    flip() {
        (this.faceShown === false) ? this.faceShown = true : this.faceShown = false;
    }

    lock() {
        this.movable = false;
    }

    unlock() {
        this.movable = true;
    }
}