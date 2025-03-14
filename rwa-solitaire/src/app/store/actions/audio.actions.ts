import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const audioActions = createActionGroup({
    source: 'Volume Control',
    events: {
        'Set Volume': props<{value: number}>(),
        'Mute': emptyProps(),
        'Unmute': emptyProps(),
        'Toggle Mute': emptyProps(),

        'Show audio controls': emptyProps(),
        'Hide audio controls': emptyProps(),
        'Toggle audio controls': emptyProps(),
    }
})
