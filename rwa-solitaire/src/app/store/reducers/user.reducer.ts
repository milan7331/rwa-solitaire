import { createReducer, on } from "@ngrx/store";
import { UserState } from "../../models/state/user.state";
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { GameHistory } from "../../models/user/game-history";
import { UserData } from "../../models/user/user-data";
import { UserStats } from "../../models/user/user-stats";
import { SavedGame } from "../../models/user/saved-game";
import { loginActions, logoutActions, sessionActions } from "../actions/auth.actions";
import { userEditActions, userMenuActions } from "../actions/user.actions";

export const gameHistoryAdapter: EntityAdapter<GameHistory> = createEntityAdapter<GameHistory>({
    // promeniti da se sortira po datumu? i da je id nešto drugo nakon što zapravo dodam modele
});

const initialUserState: UserState = {
    loginValid: false,
    userData: getInitialUserData(),
    userStats: getInitialUserStats(),
    gameHistory: gameHistoryAdapter.getInitialState(),
    savedGame: getInitialSavedGame(), 
};

const loginHandlers = [
    on(loginActions.logInSuccess, (state: UserState, { username }) => {
        return {
            ...state,
            loginValid: true,
            userData: {
                ...state.userData,
                username: username,
            },
        };
    }),
    on(loginActions.logInFailure, (state: UserState) => {
        return {
            ...state,
            loginValid: false,
        };
    }),
    on(logoutActions.logoutSuccess, (state: UserState) => {
        return {
            ...state,
            loginValid: false,
            userData: getInitialUserData(),
        };
    }),
];

const sessionHandlers = [
    on(sessionActions.validateSessionSuccess, (state: UserState, { username }) => {
        return {
            ...state,
            loginValid: true,
            userData: {
                ...state.userData,
                username: username,
            },
        };
    }),
];

const userDataHandlers = [
    on(userEditActions.getUserDataSuccess, (state: UserState, data) => {
        return {
            ...state,
            userData: data,
        }
    }),
];

const userStatsHandlers = [
    on(userMenuActions.getUserStatsSuccess, (state: UserState, stats) => {
        if (!checkUserStatsValid(stats)) return state;

        return {
            ...state,
            userStats: stats,
        }
    }),
];

export const userReducer = createReducer(
    initialUserState,
    ...loginHandlers,
    ...sessionHandlers,
    ...userDataHandlers,
    ...userStatsHandlers,
);

function getInitialUserData(): UserData {
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
