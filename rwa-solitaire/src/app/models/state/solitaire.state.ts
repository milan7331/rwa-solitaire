import { EntityState } from "@ngrx/entity";

import { SolitaireBoard } from "../solitaire/solitaire-board";

export interface SolitaireState {
    boards: EntityState<SolitaireBoard>;
    winCondition: boolean;
}
