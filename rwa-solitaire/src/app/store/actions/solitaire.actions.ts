import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { SolitaireDifficulty } from "../../models/game/solitaire-board";

export const solitaireActions = createActionGroup({
    source: "Solitaire game",
    events: {
        'Start new game': props<{difficulty: SolitaireDifficulty}>(),
        'Restart game': emptyProps(),
        
        'Draw cards': emptyProps(),
        'Drop on foundation': emptyProps(),
        'Drop on tableau': emptyProps(),
        'Undo': emptyProps(),

        'Can drop on foundation': emptyProps(),
        'Can drop on tableau': emptyProps(),
        'Move cards': emptyProps(),

    }
})