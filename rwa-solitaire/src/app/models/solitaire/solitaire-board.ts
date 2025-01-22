import { Card } from "./card";
import { SolitaireDifficulty } from "./solitaire-difficulty";

export interface SolitaireBoard {
    moveNumber: number;
    foundation: Card[][];
    tableau: Card[][];
    deckStock: Card[];
    deckWaste: Card[];
    difficulty: SolitaireDifficulty;
}