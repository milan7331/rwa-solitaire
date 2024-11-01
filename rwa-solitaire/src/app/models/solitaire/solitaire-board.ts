import { Card } from "./card";
import { Update } from "@ngrx/entity";


export enum SolitaireDifficulty {
    Easy = 0,
    Hard = 1
}

export interface SolitaireBoard {
    moveNumber: number;
    foundation: number[][];
    tableau: number[][];
    deckStock: number[];
    deckWaste: number[];
    difficulty: SolitaireDifficulty;
}
