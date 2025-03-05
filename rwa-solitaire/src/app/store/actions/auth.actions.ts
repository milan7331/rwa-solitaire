import { createActionGroup, emptyProps, props } from "@ngrx/store"

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        'Log in': props<{ username: string, password: string }>(),
        'Log in success': emptyProps(),
        'Log in failure': props<{ message: string }>(),

        'Register': emptyProps(),
        'Register success': emptyProps(),
        'Register failure': emptyProps(),

        'Logout': emptyProps(),
        'Logout Success': emptyProps(),
        'Logout Failure': props<{ message: string }>(),

        'Validate Session': emptyProps(),
        'Validate Session Success': emptyProps(),
    }
});