export enum CardSuit {
    Clubs = 0,
    Diamonds = 1,
    Hearts = 2,
    Spades = 3
}

export enum CardColor {
    Red = 0,
    Black = 1
}

export enum CardNumber {
    Ace = 0,
    Two = 1,
    Three = 2,
    Four = 3,
    Five = 4,
    Six = 5,
    Seven = 6,
    Eight = 7,
    Nine = 8,
    Ten = 9,
    Jack = 10,
    Queen = 11,
    King = 12
}

export interface Card {
    id: number;
    suit: CardSuit;
    number: CardNumber;
    color: CardColor;
    faceShown: boolean;
    movable: boolean;
    picture: string;
}