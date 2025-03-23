import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const sessionActions = createActionGroup({
    source: 'App session',
    events: {
        'Validate session': emptyProps(),
        'Validate session success': props<{ username: string }>(),
        'Validate session failure': emptyProps(),
    }
});

export const loginActions = createActionGroup({
    source: 'User login page',
    events: {
        'Log in': props<{ username: string, password: string }>(),
        'Log in success': props<{ username: string }>(),
        'Log in failure': emptyProps(),
    }
});

export const logoutActions = createActionGroup({
    source: 'User logout button',
    events: {
        'Logout': emptyProps(),
        'Logout success': emptyProps(),
        'Logout failure': emptyProps(),
    }
});