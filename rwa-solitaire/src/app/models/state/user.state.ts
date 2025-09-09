import { EntityState } from "@ngrx/entity";

import { User } from "../user/user";
import { UserStats } from "../user/user-stats";
import { GameHistory } from "../user/game-history";
import { SavedGame } from "../user/saved-game";

export interface UserState {
    loginValid: boolean;
    registerValid: boolean;

    user: User;
    userStats: UserStats;
    gameHistory: EntityState<GameHistory>;
    savedGame: SavedGame;

    registerLoading: boolean;
    loginLoading: boolean;
    userDataLoading: boolean;
    userStatsLoading: boolean;

    registerErrorMessage: string;
    loginErrorMessage: string;
    userDataErrorMessage: string;
    userStatsErrorMessage: string;
}
