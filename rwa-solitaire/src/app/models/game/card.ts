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

export interface Card {
    id: number;
    suit: CardSuit;
    number: CardNumber;
    color: CardColor;
    faceShown: boolean;
    movable: boolean;
    picture: string;
}