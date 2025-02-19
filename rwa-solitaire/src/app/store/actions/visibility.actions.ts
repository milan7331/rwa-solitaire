import { createActionGroup, emptyProps } from "@ngrx/store";

export const visibilityActions = createActionGroup({
    source: 'Component visibility control',
    events: {
        'Show audio controls': emptyProps(),
        'Hide audio controls': emptyProps(),
        'Toggle audio controls': emptyProps(),

        'Show about page': emptyProps(),
        'Hide about page': emptyProps(),
        'Toggle about page': emptyProps()
    }
})