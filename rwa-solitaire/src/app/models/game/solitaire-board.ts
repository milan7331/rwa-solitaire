import { Card, CardColor, CardNumber, CardSuit } from "./card";
import { EntityState, Update } from "@ngrx/entity";


export enum SolitaireDifficulty {
    Easy = 0,
    Hard = 1
}

export interface SolitaireBoard {
    moveNumber: number;
    previousCardUpdate: Update<Card> | undefined;

    foundation: number[][];
    tableau: number[][];
    deckStock: number[];
    deckWaste: number[];
    difficulty: SolitaireDifficulty;
}
