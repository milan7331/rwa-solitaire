import { EntityState, Update } from "@ngrx/entity";
import { Card } from "../solitaire/card";
import { SolitaireBoard } from "../solitaire/solitaire-board";
import { PreviousUpdate } from "../solitaire/previous-update";

export interface SolitaireState {
    cards: EntityState<Card>;
    boards: EntityState<SolitaireBoard>;
    previousCardUpdate: EntityState<PreviousUpdate>;
    winCondition: boolean;
}
