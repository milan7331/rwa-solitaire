import { createReducer, on } from "@ngrx/store";
import { UserState } from "../../models/state/user.state";
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { GameHistory } from "../../models/user/game-history";
import { AuthActions } from "../actions/auth.actions";
import { UserData } from "../../models/user/user-data";
import { UserStats } from "../../models/user/user-stats";
import { SavedGame } from "../../models/user/saved-game";

export const gameHistoryAdapter: EntityAdapter<GameHistory> = createEntityAdapter<GameHistory>({
    // promeniti da se sortira po datumu? i da je id nešto drugo nakon što zapravo dodam modele
});

export const initialUserState: UserState = {
    isLoggedIn: false,
    userData: getInitialUserData(),
    userStats: getInitialUserStats(),
    gameHistory: gameHistoryAdapter.getInitialState(),
    savedGame: getInitialSavedGame(), 
};

export const userReducer = createReducer(
    initialUserState,
    on(AuthActions.logInSuccess, (state, { username }) => {
        return {
            ...state,
            isLoggedIn: true,
            userData: {
                ...state.userData,
                username: username,
            },
        };
    }),
    on(AuthActions.validateSessionSuccess, (state, { username }) => {
       return {
        ...state,
        isLoggedIn: true,
        userData: {
            ...state.userData,
            username: username,
        },
       };
    }),
    on(AuthActions.logInFailure, (state) => {
        return {
            ...state,
            isLoggedIn: false,
        };
    }),
    on(AuthActions.logoutSuccess, (state) => {
        return {
            ...state,
            isLoggedIn: false,
            userData: getInitialUserData(),
        };
    })

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
