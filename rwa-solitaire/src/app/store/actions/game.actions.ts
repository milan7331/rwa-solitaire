import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { SolitaireDifficulty } from "../../models/game/solitaire-board";
import { CardSuit } from "../../models/game/card";

export const gameActions = createActionGroup({
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