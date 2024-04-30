import { Card } from "../../core/models/card";
import { CardSuit, CardFace, CardNumber } from "../../core/models/card";
import { SolitaireState } from "../state/solitaire.state";
import { cloneDeep } from 'lodash';

export class SolitaireBoard {

    static readonly TABLEAU_ROWS: number = 20;
    static readonly TABLEAU_COLS: number = 7;
    static readonly FOUNDATION_ROWS: number = 13;
    static readonly FOUNDATION_COLS: number = 4;

    constructor() {
    }

    static initializeBoard() : SolitaireState {
        let solitaireState: SolitaireState = { tableau: [], foundation: [], deck: [], waste: []};

        this.initializeTableau(solitaireState.tableau);
        this.initializeFoundation(solitaireState.foundation);
        this.initializeDeck(solitaireState.deck);

        return solitaireState;
    } 

    static initializeTableau(tableau: Card[][]) {
        for (let i = 0; i < this.TABLEAU_COLS; i++) {
            tableau.push(Array(this.TABLEAU_ROWS).fill(null));
        }
    }

    static initializeFoundation(foundation: Card[][]) {
        for (let i = 0; i < this.FOUNDATION_COLS; i++) {
            foundation.push(Array(this.FOUNDATION_ROWS).fill(null));
        }
    }

    static initializeDeck(deck: Card[]) {
        this.populateDeck(deck);
        deck = this.shuffleDeck(deck);

    }

    static populateDeck(deck: Card[]) {
        for (let suit of Object.values(CardSuit)) {
            for (let number of Object.values(CardNumber)) {
                deck.push({ suit: suit, number: number} as Card);
            }
        }
    }

    static shuffleDeck(deck: Card[]) : Card[] {
        let new_deck: Card[] = cloneDeep<Card[]>(deck);
        for (let i = new_deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [new_deck[i], new_deck[j]] = [new_deck[j], new_deck[i]];
        }

        return new_deck;
    }

    static printCards(solitaireState: SolitaireState) {
        solitaireState.deck.forEach(element => {
            console.log(element.suit + " - " + element.number)
        });
    }

    static testSwapCardsFromDeck(deck: Card[], index1: number, index2: number) : Card[] {
        let new_deck: Card[] = cloneDeep<Card[]>(deck);
        [new_deck[index1], new_deck[index2]] = [new_deck[index2], new_deck[index1]];
        return new_deck;
    }
}