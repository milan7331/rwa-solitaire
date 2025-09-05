import { EntityState } from "@ngrx/entity";

import { User } from "../user/user";
import { UserStats } from "../user/user-stats";
import { GameHistory } from "../user/game-history";
import { SavedGame } from "../user/saved-game";

export interface UserState {
    loginValid: boolean;

    userData: User;
    userStats: UserStats;
    gameHistory: EntityState<GameHistory>;
    savedGame: SavedGame;
}
