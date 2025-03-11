import { EntityState } from "@ngrx/entity";

import { UserData } from "../user/user-data";
import { UserStats } from "../user/user-stats";
import { GameHistory } from "../user/game-history";
import { SavedGame } from "../user/saved-game";

export interface UserState {
    isLoggedIn: boolean;

    userData: UserData;
    userStats: UserStats;
    gameHistory: EntityState<GameHistory>;
    savedGame: SavedGame;
}
