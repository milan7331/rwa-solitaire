import { SolitaireMove } from "./solitaire-move";

export interface SolitaireHints {
    moves: SolitaireMove[];
    cycleDeck: boolean;
    hintIndex: number;
    hintVisible: boolean;
}