import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { SolitaireDifficulty } from "../../models/game/solitaire-board";
import { CardSuit } from "../../models/game/card";

export const solitaireActions = createActionGroup({
    source: "Solitaire game",
    events: {
        'Start new game': props<{difficulty: SolitaireDifficulty}>(),
        'Restart game': emptyProps(),
        
        'Draw cards': emptyProps(),
        'Drop on foundation': props<{source: number[], dest: number[], sourceIndex: number, suit: CardSuit}>(),
        'Drop on tableau': props<{source: number[], dest: number[], sourceIndex: number, suit: CardSuit}>(),
        'Undo': emptyProps(),

        'Can drop on foundation': emptyProps(),
        'Can drop on tableau': emptyProps(),
        'Move cards': emptyProps(),

    }
})