import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { SolitaireDifficulty } from "../../models/solitaire/solitaire-board";
import { CardSuit } from "../../models/solitaire/card";

export const solitaireActions = createActionGroup({
    source: "Solitaire game",
    events: {
        'Start new game': props<{difficulty: SolitaireDifficulty}>(),
        'Restart game': emptyProps(),
        
        'Draw cards': emptyProps(),
        'Drop on foundation': props<{suit: CardSuit, src: number[], dest: number[], srcIndex: number}>(),
        'Drop on tableau': props<{src: number[], dest: number[], srcIndex: number}>(),
        'Undo': emptyProps(),

    }
})