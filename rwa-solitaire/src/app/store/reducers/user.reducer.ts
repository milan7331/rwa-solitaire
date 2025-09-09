import { createReducer, on } from "@ngrx/store";
import { UserState } from "../../models/state/user.state";
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { GameHistory } from "../../models/user/game-history";
import { User } from "../../models/user/user";
import { UserStats } from "../../models/user/user-stats";
import { SavedGame } from "../../models/user/saved-game";
import { userDataActions, userStatsActions, loginActions, logoutActions, sessionActions, registerActions } from "../actions/user.actions";

export const gameHistoryAdapter: EntityAdapter<GameHistory> = createEntityAdapter<GameHistory>({
    selectId: (game) => game.id,
    sortComparer: (a: GameHistory, b: GameHistory) => b.finishedTime.getTime() - a.finishedTime.getTime(),
});

const initialUserState: UserState = {
    loginValid: false,
    registerValid: false,

    user: getInitialUser(),
    userStats: getInitialUserStats(),
    gameHistory: gameHistoryAdapter.getInitialState(),
    savedGame: getInitialSavedGame(),

    registerLoading: false,
    loginLoading: false,
    userDataLoading: false,
    userStatsLoading: false,

    registerErrorMessage: '',
    loginErrorMessage: '',
    userDataErrorMessage: '',
    userStatsErrorMessage: ''
};

const registerHandlers = [
    on(registerActions.register, (state: UserState) => {
        return {
            ...state,
            registerErrorMessage: '',
            registerLoading: true
        };
    }),
    on(registerActions.registerSuccess, (state: UserState) => {
        return {
            ...state,
            registerValid: true,
            registerLoading: false,
        };
    }),
    on(registerActions.registerFailure, (state: UserState, action) => {
        return {
            ...state,
            registerLoading: false,
            registerErrorMessage: action?.message ?? '!!!'
        }
    }),
    on(registerActions.registerClearError, (state: UserState) => {
        return {
            ...state,
            registerErrorMessage: '',
        }
    }),
    on(registerActions.clearRegisterValid, (state: UserState) => {
        return {
            ...state,
            registerValid: false,
        }
    })
]

const loginHandlers = [
    on(loginActions.logIn, (state: UserState) => {
        return {
            ...state,
            loginErrorMessage: '',
            loginLoading: true
        }
    }),
    on(loginActions.logInSuccess, (state: UserState, { username }) => {
        return {
            ...state,
            loginValid: true,
            user: {
                ...state.user,
                username: username,
            },
            loginLoading: false,
            userDataLoading: true,
            userStatsLoading: true,
            loginErrorMessage: ''
        };
    }),
    on(loginActions.logInFailure, (state: UserState, action) => {
        return {
            ...state,
            loginValid: false,
            user: getInitialUser(),
            loginLoading: false,
            loginErrorMessage: action.message ?? ' Error logging in!'
        };
    }),
    on(loginActions.logInClearError, (state: UserState) => {
        return {
            ...state,
            loginErrorMessage: ''
        }
    }),
    on(logoutActions.logoutSuccess, (state: UserState) => {
        return {
            ...state,
            loginValid: false,
            user: getInitialUser(),
        };
    }),
];

const sessionHandlers = [
    on(sessionActions.validateSessionSuccess, (state: UserState, { username }) => {
        return {
            ...state,
            loginValid: true,
            user: {
                ...state.user,
                username: username,
            },
            userDataLoading: true,
            userStatsLoading: true
        };
    }),
    on(sessionActions.validateSessionFailure, (state: UserState) => {
        return {
            ...state,
            loginValid: false,
            user: getInitialUser(),
        }
    })
];

const userDataHandlers = [
    on(userDataActions.getUserSuccess, (state: UserState, user) => {
        return {
            ...state,
            user: user,
            userDataLoading: false
        }
    }),
    on(userDataActions.getUserFailure, (state: UserState, action) => {
        return {
            ...state,
            user: getInitialUser(),
            userDataLoading: false,
            userDataErrorMessage: action.message ?? 'Error loading user data!'
        }
    })
];

const userStatsHandlers = [
    on(userStatsActions.getUserStatsSuccess, (state: UserState, stats) => {
        if (!checkUserStatsValid(stats)) return state;

        return {
            ...state,
            userStats: stats,
            userStatsLoading: false,
        }
    }),
    on(userStatsActions.getUserStatsFailure, (state: UserState, action) => {
        return {
            ...state,
            userStats: getInitialUserStats(),
            userStatsLoading: false,
            userStatsErrorMessage: action.message ?? 'Error loading user stats!'
        }
    }),
    on(userStatsActions.getUserStatsClearError, (state: UserState) => {
        return {
            ...state,
            userStatsErrorMessage: '',
        }
    })
];

export const userReducer = createReducer(
    initialUserState,
    ...registerHandlers,
    ...loginHandlers,
    ...sessionHandlers,
    ...userDataHandlers,
    ...userStatsHandlers,
);

function getInitialUser(): User {
    return {
        id: -1,
        createdAt: new Date(),
        email: '',
        username: ''
    };
}

function getInitialUserStats(): UserStats {
    return {
        id: -1,
        averageSolveTime: 0,
        fastestSolveTime: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        totalTimePlayed: 0,
    };
}

function getInitialSavedGame(): SavedGame {
    return {
        id: -1
    };
}

function checkUserStatsValid(stats: UserStats): boolean {
    const {
        averageSolveTime,
        fastestSolveTime,
        gamesPlayed,
        gamesWon,
        totalTimePlayed
    } = stats;

    if (averageSolveTime < 0) return false;
    if (fastestSolveTime < 0) return false;
    if (gamesPlayed < 0) return false;
    if (gamesWon < 0 || gamesWon > gamesPlayed) return false;
    if (totalTimePlayed < 0) return false;

    return true;
}
