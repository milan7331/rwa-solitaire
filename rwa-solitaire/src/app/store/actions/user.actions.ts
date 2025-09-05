import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { User } from "../../models/user/user";
import { UserStats } from "../../models/user/user-stats";

export const userEditActions = createActionGroup({
    source: 'User edit page',
    events: {
        'Get user': emptyProps(),
        'Get user success': props<User>(),
        'Get user failure': emptyProps(),
    }
});

export const userMenuActions = createActionGroup({
    source: 'Menu page',
    events: {
        'Get user stats': emptyProps(),
        'Get user stats success': props<UserStats>(),
        'Get user stats failure': emptyProps(),
    }
})

export const userRegisterActions = createActionGroup({
    source: 'Register user page',
    events: {
        'Register': props<{ email: string, username: string, password: string, firstname?: string, lastname?: string }>(),
        'Register success': emptyProps(),
        'Register failure': emptyProps(),
    }
});

export const userSavedGameActions = createActionGroup({
    source: 'Menu page | continue saved game ',
    events: {
        'Load saved game': emptyProps(),
        'Load saved game success': props<any>(), // dodati solitaire board ili nešto slično
        'Load saved game failure': emptyProps(),
    }
})