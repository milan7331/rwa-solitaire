import { Card } from "./card";

export interface SolitaireMove {
    source: Card[];
    dest: Card[];
    sourceIndex: number;
}