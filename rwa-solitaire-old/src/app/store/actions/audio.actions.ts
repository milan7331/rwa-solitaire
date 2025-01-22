import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const volumeControlActions = createActionGroup({
    source: 'Volume Control',
    events: {
        'Set Volume': props<{value: number}>(),
        'Mute': emptyProps(),
        'Unmute': emptyProps(),
        'Toggle Mute': emptyProps()
    }
})