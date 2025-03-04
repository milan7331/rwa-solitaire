import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "../../models/state/app.state";
import { audioReducer } from "./audio.reducer";
import { visibilityReducer } from "./visibility.reducer";
import { solitaireReducer } from "./solitaire.reducer";
import { userReducer } from "./user.reducer";

export const rootReducer: ActionReducerMap<AppState> = {
    audioState: audioReducer,
    visibilityState: visibilityReducer,
    solitaireState: solitaireReducer,
    userState: userReducer,
}