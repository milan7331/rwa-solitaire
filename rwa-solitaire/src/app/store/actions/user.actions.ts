import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const userActions = createActionGroup({
    source: 'User',
    events: {
        'Register': props<{ email: string, username: string, password: string }>(),
        'Registration success': emptyProps(),
        'Registration failure': props<{ message: string }>(),

        'Get user data': emptyProps(),

        'Get user stats' : emptyProps(),

        'Save game': emptyProps(),
        'Load game': emptyProps(),
        'Delete saved game': emptyProps(),
    }
})