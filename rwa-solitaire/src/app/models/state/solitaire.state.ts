import { Dictionary, EntityState } from "@ngrx/entity";
import { Card } from "../game/card";
import { SolitaireBoard } from "../game/solitaire-board";
import { SolitaireMove } from "../game/solitaire-move";
import { SolitaireHints } from "../game/solitaire-hints";

export interface SolitaireState {
    cards: EntityState<Card>;
    boards: EntityState<SolitaireBoard>;
    // availableMoves: SolitaireHints;
}
