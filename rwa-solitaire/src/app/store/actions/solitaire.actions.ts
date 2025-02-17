import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { SolitaireDifficulty } from "../../models/solitaire/solitaire-difficulty";
import { Card, CardSuit } from "../../models/solitaire/card";

export const solitaireActions = createActionGroup({
    source: "Solitaire game",
    events: {
        'Start new game': props<{difficulty: SolitaireDifficulty}>(),
        'Restart game': emptyProps(),
        
        'Draw cards': emptyProps(),
        'Drop on foundation': props<{src: Card[], dest: Card[], srcIndex: number}>(),
        'Drop on tableau': props<{src: Card[], dest: Card[], srcIndex: number}>(),
        'Undo': emptyProps(),

        'ShowHints': emptyProps(),
        'ResetHints': emptyProps()

    }
})