import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { UserData } from "../../models/user/user-data";
import { UserStats } from "../../models/user/user-stats";

export const dashboardActions = createActionGroup({
    source: 'User dashboard page',
    events: {
        'Get user data': emptyProps(),
        'Get user data success': props<UserData>(),
        'Get user data failure': emptyProps(),

        'Get user stats': emptyProps(),
        'Get user stats success': props<UserStats>(),
        'Get user stats failure': emptyProps(),
    }
});

export const registerActions = createActionGroup({
    source: 'Register user page',
    events: {
        'Register': props<{ email: string, username: string, password: string, firstname?: string, lastname?: string }>(),
        'Register success': emptyProps(),
        'Register failure': emptyProps(),
    }
});