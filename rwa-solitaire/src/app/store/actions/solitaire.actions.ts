import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { SolitaireDifficulty } from "../../models/game/solitaire-board";
import { Card, CardSuit } from "../../models/game/card";
import { EntityState } from "@ngrx/entity";

export const solitaireActions = createActionGroup({
    source: "Solitaire game",
    events: {
        'Start new game': props<{difficulty: SolitaireDifficulty}>(),
        'Restart game': emptyProps(),
        
        'Draw cards': emptyProps(),
        'Drop on foundation': props<{suit: CardSuit, src: number[], dest: number[], srcIndex: number}>(),
        'Drop on tableau': props<{suit: CardSuit, src: number[], dest: number[], srcIndex: number}>(),
        'Undo': emptyProps(),

    }
})