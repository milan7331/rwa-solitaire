import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "../../models/state/app.state";
import { audioReducer } from "./audio.reducer";
import { visibilityReducer } from "./visiblity.reducer";

export const appReducer: ActionReducerMap<AppState> = {
    audioState: audioReducer,
    visibilityState: visibilityReducer
}
