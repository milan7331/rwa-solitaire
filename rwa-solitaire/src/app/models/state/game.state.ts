import { EntityState, Update } from "@ngrx/entity";
import { Card } from "../game/card";
import { SolitaireBoard } from "../game/solitaire-board";
import { PreviousUpdate } from "../game/previous-update";

export interface GameState {
    cards: EntityState<Card>;
    boards: EntityState<SolitaireBoard>;
    previousCardUpdate: EntityState<PreviousUpdate>;
    winCondition: boolean;
}
