import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const audioActions = createActionGroup({
    source: 'Volume Control Component',
    events: {
        'Set Volume': props<{value: number}>(),
        'Mute': emptyProps(),
        'Unmute': emptyProps(),
        'Toggle Mute': emptyProps(),
    }
});
