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

export class Card {
    suit: CardSuit;
    number: CardNumber;
    color: CardColor;
    faceShown: boolean;
    movable: boolean;
    picture: string;

    constructor(suit: CardSuit, number: CardNumber)
    {
        this.suit = suit;
        this.number = number;
        this.color = (suit == CardSuit.Diamonds || suit == CardSuit.Hearts)? CardColor.Red : CardColor.Black;
        this.faceShown = false;
        this.movable = false;
        this.picture = this.setPicture(suit, number);
    }

    flipUp(): void {
        this.faceShown = true;
    }

    flipDown(): void {
        this.faceShown = false;
    }

    lock(): void {
        this.movable = false;
    }

    unlock(): void {
        this.movable = true;
    }

    clone(): Card {
        let newCard: Card = new Card(this.suit, this.number);
        (this.faceShown)? newCard.flipUp() : newCard.flipDown();
        (this.movable)? newCard.unlock() : newCard.lock();

        return newCard;
    }

    private setPicture(suit: CardSuit, number: CardNumber): string {
        const suitString: string | undefined = this.getCardSuitName(suit);

        if (suitString === undefined) return "placeholder_default";
        return suitString + "_" + number;
    }

    private getCardSuitName(suit: CardSuit): string | undefined {
        switch (suit) {
            case CardSuit.Clubs:
                return "clubs";
            case CardSuit.Diamonds:
                return "diamonds";
            case CardSuit.Hearts:
                return "hearts";
            case CardSuit.Spades:
                return "spades";
            default:
                return undefined;
        }
    }
    
}