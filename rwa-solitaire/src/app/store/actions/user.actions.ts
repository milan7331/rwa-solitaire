import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { User } from "../../models/user/user";
import { UserStats } from "../../models/user/user-stats";


export const registerActions = createActionGroup({
    source: 'Register user page',
    events: {
        'Register': props<{ email: string, username: string, password: string, firstname?: string, lastname?: string }>(),
        'Register success': emptyProps(),
        'Register failure': props<{ message: string }>(),

        'Register clear error': emptyProps(),
        'Clear registerValid': emptyProps(),
    }
});

export const loginActions = createActionGroup({
    source: 'User login page',
    events: {
        'Log in': props<{ username: string, password: string }>(),
        'Log in success': props<{ username : string }>(),
        'Log in failure': props<{ message: string }>(),

        'Log in clear error': emptyProps(),
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

export const sessionActions = createActionGroup({
    source: 'App session',
    events: {
        'Validate session': emptyProps(),
        'Validate session success': props<{ username: string }>(),
        'Validate session failure': emptyProps(),
    }
});

export const userDataActions = createActionGroup({
    source: 'Load user data',
    events: {
        'Get user': emptyProps(),
        'Get user success': props<User>(),
        'Get user failure': props<{ message: string }>(),

        'Get user clear error': emptyProps(),
    }
});

export const userStatsActions = createActionGroup({
    source: 'Load user stats',
    events: {
        'Get user stats': emptyProps(),
        'Get user stats success': props<UserStats>(),
        'Get user stats failure':props<{ message: string }>(),

        'Get user stats clear error': emptyProps(),
    }
});

export const editUserActions = createActionGroup({
    source: 'User edit page',
    events: {
        'Edit user': props<{ email: string, password: string, newPassword: string, firstname: string, lastname: string }>(),
        'Edit user success': emptyProps(),
        'Edit user failure': props<{ message: string }>(),

        'Edit user clear error': emptyProps(),
        'Clear editValid': emptyProps()
    }
});

export const deleteAccountActions = createActionGroup({
    source: 'Delete account dialog',
    events: {
        'Delete account': emptyProps(),
        'Delete account success': emptyProps(),
        'Delete account failure': emptyProps()
    }
})

export const savedGameActions = createActionGroup({
    source: 'Saved game actions',
    events: {
        'Save game': emptyProps(),
        'Save game success': emptyProps(),
        'Save game failure': emptyProps(),

        'Load game': emptyProps(),
        'Load game success': emptyProps(),
        'Load game failure': emptyProps(),

        'Check saved game available': emptyProps(),
        'Check saved game available success': emptyProps(),
        'Check saved game available failure': emptyProps(),

        'Load saved game': emptyProps(),
        'Load saved game success': props<any>(),
        'Load saved game failure': emptyProps(),

        'Delete saved game': emptyProps(),
        'Delete saved game success': emptyProps(),
        'Delete saved game failure': emptyProps(),
    }
})