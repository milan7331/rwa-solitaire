import { Card, CardColor, CardNumber, CardSuit } from "./card";

export enum SolitaireDifficulty {
    Easy = 0,
    Hard = 1
}

export class SolitaireBoard {

    foundation: Card[][] = [[], [], [], []];
    tableau: Card[][] = [[], [], [], [], [], [], []];
  
    deckStock: Card[] = [];
    deckWaste: Card[] = [];

    difficulty: SolitaireDifficulty = 1;

    constructor() {
        this.startNewGame();
    }

    public startNewGame() {
        this.clearBoard();
        this.generateDeck();
        this.fisherYatesShuffle(this.deckStock);
        this.placeInitialCards();

    }


    private clearBoard(): void {
        for (let i = 0; i < this.foundation.length; i++) this.foundation[i] = [];

        for (let i = 0; i < this.tableau.length; i++) this.tableau[i] = [];

        this.deckStock = [];
        this.deckWaste = [];
    }

    private generateDeck(): void {
        const suits = Object.values(CardSuit).filter(value => typeof value === 'number');
        const numbers = Object.values(CardNumber).filter(value => typeof value === 'number');

        suits.forEach(suit => {
           numbers.forEach(number => {
            this.deckStock.push(new Card(suit as CardSuit, number as CardNumber));
           });
        });
    }

    public fisherYatesShuffle(cards: Card[]): void {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    private placeInitialCards() : boolean {
        if (this.deckStock.length !== 52) return false;

        for (let i = 0; i < this.tableau.length; i++) {
            for(let j = 0; j <i + 1; j++) {
                this.tableau[i].push(this.deckStock.pop()!);
            }
        }

        this.tableau.forEach(tab => {
            tab.at(-1)!.flipUp();
            tab.at(-1)!.unlock();
        })

        for (let i = 0; i < this.deckStock.length; i++) {
            this.deckStock[i].unlock();
            this.deckStock[i].flipUp();
        }

        return true;
    }

    public toggleDifficulty(): void {
        if (this.difficulty === SolitaireDifficulty.Easy) {
            this.difficulty = SolitaireDifficulty.Hard;
        } else {
            this.difficulty = SolitaireDifficulty.Easy;
        }

        this.startNewGame();
    }

    public drawCards(): void {
        if(this.deckStock.length === 0 && this.deckWaste.length !== 0) {
            while (this.deckWaste.length > 0) this.deckStock.push(this.deckWaste.pop()!);
        } else {
            if (this.difficulty === SolitaireDifficulty.Hard) {
                for (let i = 0; i < 3; i++) {
                    if (this.deckStock.length > 0) {
                        this.deckWaste.push(this.deckStock.pop()!);
                    }
                    else break;
                }
            } else {
                if (this.deckStock.length > 0) this.deckWaste.push(this.deckStock.pop()!);
            }
        }
    }


    

    public canDropOnFoundation(source: Card[] | null, dest: Card[] | null, sourceIndex: number | null, suit: CardSuit): boolean {
        if (source === null || dest === null || sourceIndex === null) return false; 
        if (sourceIndex < 0 || source.length <= sourceIndex) return false;

        const cardsToMove: Card[] = source.slice(sourceIndex);

        if (cardsToMove.length !== 1 || cardsToMove[0].suit !== suit) return false;

        const dropAce: boolean = dest.length === 0 && cardsToMove[0].number === CardNumber.Ace;
        const dropRegular: boolean | undefined = cardsToMove[0].number - dest[dest.length - 1]?.number === 1; 

        if (dropAce || dropRegular) return true;

        return false;
    }

    public dropOnFoundation(source: Card[] | null, dest: Card[] | null, sourceIndex: number | null, suit: CardSuit): boolean {
        if (this.canDropOnFoundation(source, dest, sourceIndex, suit)) {
            return this.moveCards(source!, dest!, sourceIndex!);
        }

        return false;
    }

    public canDropOnTableau(source: Card[] | null, dest: Card[] | null, sourceIndex: number | null): boolean {
        if (source === null || dest === null || sourceIndex === null || source === dest) return false;
        if (sourceIndex < 0 || source.length <= sourceIndex) return false;

        const cardsToMove: Card[] = source.slice(sourceIndex);

        if (cardsToMove.length <= 0) return false;

        const dropKing: boolean = dest.length === 0 && cardsToMove[0].number === CardNumber.King;
        const dropRegularColor: boolean | undefined = cardsToMove[0].color !== dest[dest.length -1]?.color;
        const dropRegularNumber: boolean | undefined = dest[dest.length - 1]?.number - cardsToMove[0].number === 1;

        if (dropKing || (dropRegularColor && dropRegularNumber)) return true;

        return false;
    }

    public dropOnTableau(source: Card[] | null, dest: Card[] | null, sourceIndex: number | null): boolean {
        if (this.canDropOnTableau(source, dest, sourceIndex)) {
            return this.moveCards(source!, dest!, sourceIndex!);
        }

        return false;
    }

    private moveCards(source: Card[], dest: Card[], sourceIndex: number): boolean {
        if (sourceIndex < 0 || source.length <= sourceIndex) return false;

        const cardsToMove = source.slice(sourceIndex);
        dest.push(...cardsToMove);
        source.length = sourceIndex;

        if (source.length !== 0) {
            source[source.length - 1].flipUp();
            source[source.length - 1].unlock();
        }

        return true;
    }

}