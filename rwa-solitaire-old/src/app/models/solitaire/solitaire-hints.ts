import { Card } from "./card";

export interface SolitaireHints {
    moves: SolitaireMove[],
    cycleDeck: boolean,
    hintIndex: number,
    hintVisible: boolean
}

export interface SolitaireMove {
    source: number[];
    dest: number[];
    sourceIndex: number;
}