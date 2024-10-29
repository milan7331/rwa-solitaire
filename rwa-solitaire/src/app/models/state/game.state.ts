import { EntityState } from "@ngrx/entity";
import { Card } from "../game/card";
import { SolitaireBoard } from "../game/solitaire-board";



export interface GameState {
    cards: EntityState<Card>;
    boards: EntityState<SolitaireBoard>;

    // previousCardUpdate: EntityState<Update<Card>>;
    // winCondition: boolean;
    
}