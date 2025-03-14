import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { UserData } from "../../models/user/user-data";
import { UserStats } from "../../models/user/user-stats";

export const userActions = createActionGroup({
    source: 'User',
    events: {
        'Register': props<{ email: string, username: string, password: string, firstname?: string, lastname?: string }>(),
        'Registration success': emptyProps(),
        'Registration failure': emptyProps(),

        'Get user data': props<{ username: string }>(),
        'Get user data success': props<UserData>(),
        'Get user data failure': emptyProps(),

        'Get user stats': props<{ username: string }>(),
        'Get user stats success': props<UserStats>(),
        'Get user stats failure': emptyProps(),

        'Get user game history': props<{ username: string }>(),
        'Get user game history success': emptyProps(),
        'Get user game history failure': emptyProps(),
        
        'Load game': emptyProps(),
        'Load game success': emptyProps(),
        'Load game failure': emptyProps(),


        'Save game': emptyProps(),
        'Save game success': emptyProps(),
        'Save game failure': emptyProps(),

        'Delete saved game': emptyProps(),
        'Delete saved game success': emptyProps(),
        'Delete saved game failure': emptyProps(),
    }
})