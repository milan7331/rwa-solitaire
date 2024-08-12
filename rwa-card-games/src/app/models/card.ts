export enum CardSuit {
    Clubs = 'clubs',
    Diamonds = 'diamonds',
    Hearts = 'hearts',
    Spades = 'spades'
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
        this.picture = suit + "_" + number;
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