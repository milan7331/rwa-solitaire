import { createActionGroup, emptyProps, props } from "@ngrx/store"

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        'Log in': props<{ username: string, password: string }>(),
        'Log in success': props<{ username: string }>(),
        'Log in failure': emptyProps(),

        'Logout': emptyProps(),
        'Logout success': emptyProps(),
        'Logout failure': emptyProps(),

        'Validate session': emptyProps(),
        'Validate session success': props<{ username: string }>(),
        'Validate session failure': emptyProps(),
    }
});