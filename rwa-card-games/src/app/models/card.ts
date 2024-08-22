import { CardSuit, CardColor, CardNumber } from "./card.enums";

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