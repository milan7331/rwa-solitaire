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

// redosled
// 1. pokrenuti nest da vidimo da li sve radi
// | 1.1 pogledati ono za circular dependency solutions itd, mozda ne mora forward ref itd ako se koriste provideri a ne imports array
// 2. generisati mock fake podatke za db
// 3. effects layer za podatke
// 4. dodati mini animacije
// 5. dokumentacija / git readme
// 6. mozda provaliti mail stuff za registraciju
// 7. naci neki hosting i we go public