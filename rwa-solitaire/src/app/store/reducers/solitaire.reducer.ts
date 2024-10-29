import { ActionReducerMap, createReducer, on, combineReducers } from "@ngrx/store";
import { SolitaireState } from "../../models/state/solitaire.state";
import { gameActions } from "../actions/game.actions";
import { SolitaireBoard, SolitaireDifficulty } from "../../models/game/solitaire-board";
import { Card, CardNumber, CardSuit, CardColor } from "../../models/game/card";
import { createEntityAdapter, EntityAdapter, EntityState, Update } from "@ngrx/entity";
import { gameReducer } from "./game.reducer";

export const solitaireReducer = combineReducers<SolitaireState>({
    gameState: gameReducer,
    // hintsState: hintsReducer
});




