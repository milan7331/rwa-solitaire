import { Card } from "../../core/models/card";

export interface SolitaireState {
    tableau: Card[][];
    foundation: Card[][];
    deck: Card[];
    waste: Card[];
}