import { EntityState } from "@ngrx/entity";

import { SolitaireBoard } from "../solitaire/solitaire-board";
import { SolitaireDifficulty } from "../solitaire/solitaire-difficulty";
import { SolitaireHints } from "../solitaire/solitaire-hints";

export interface SolitaireState {
    boards: EntityState<SolitaireBoard>;
    winCondition: boolean;
    difficulty: SolitaireDifficulty;
}
