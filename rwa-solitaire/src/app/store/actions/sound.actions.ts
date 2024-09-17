import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";

export const volumeControl = createActionGroup({
    source: 'Volume Control',
    events: {
        'Set Volume': props<{value: number}>(),
        'Mute': emptyProps(),
        'Unmute': emptyProps(),
        'Toggle Mute': emptyProps()
    }
})

export const playSound = createActionGroup({
    source: 'Sound',
    events: {
        'Card drop sucessful': emptyProps(),
        'Card drop unsuccessful': emptyProps(),
        'Card flip up': emptyProps(),
        'Card pick up': emptyProps(),
        'Deck draw': emptyProps(),
        'Deck rewind': emptyProps(),
        'Level complete': emptyProps(),
        'Button press': emptyProps(),
        'Notification': emptyProps(),
        'Pop up': emptyProps(),
        'Undo': emptyProps(),
        'Error': emptyProps()
    }
})