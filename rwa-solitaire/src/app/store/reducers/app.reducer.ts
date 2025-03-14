import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "../../models/state/app.state";
import { audioReducer } from "./audio.reducer";
import { solitaireReducer } from "./solitaire.reducer";
import { userReducer } from "./user.reducer";
import { leaderboardsReducer } from "./leaderboards.reducer";

export const rootReducer: ActionReducerMap<AppState> = {
    audioState: audioReducer,
    solitaireState: solitaireReducer,
    userState: userReducer,
    leaderboardsState: leaderboardsReducer,
};