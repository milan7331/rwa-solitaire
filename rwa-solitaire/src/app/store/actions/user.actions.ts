import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const userActions = createActionGroup({
    source: 'User',
    events: {   
        'Get user data': emptyProps(),

        'Get user stats' : emptyProps(),

        'Save game': emptyProps(),
        'Load game': emptyProps(),
        'Delete saved game': emptyProps(),
    }
})