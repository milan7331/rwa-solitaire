
export enum CardSuit {
    CLUBS = 'clubs',
    DIAMONDS = 'diamonds',
    HEARTS = 'hearts',
    SPADES = 'spades'
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
    Jack = 12,
    Queen = 13,
    King = 14
}

export enum CardFace {
    Hidden = 0,
    Shown = 1
}

export class Card {
    suit: CardSuit;
    number : CardNumber;
    face: CardFace;
    picture: string;

    constructor(suit: CardSuit, number: CardNumber)
    {
        this.suit = suit;
        this.number = number;
        this.face = CardFace.Hidden;
        this.picture = "assets/cards/" + suit + "_" + number + ".png";
    }

    flip() {
        (this.face === CardFace.Hidden) ? this.face = CardFace.Shown : this.face = CardFace.Hidden;
    }




}