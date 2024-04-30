import { createReducer, on } from "@ngrx/store";
import * as SolitaireActions from "./solitaire.action"
import { Card } from "../../core/models/card";
import { SolitaireState } from "../state/solitaire.state";
import { SolitaireBoard } from "../models/solitaire-board";


export const initialState: SolitaireState = {
    tableau: [],
    foundation: [],
    deck: [],
    waste: []
};

export const solitaireReducer = createReducer(
    initialState,
    on(SolitaireActions.initializeDeck, (state) => {
        let board = SolitaireBoard.initializeBoard();
        return {
            ...state,
            tableau: board.tableau,
            foundation: board.foundation,
            deck: board.deck,
        }
    }),
    on(SolitaireActions.shuffleDeck, (state) => {
        let shuffled = SolitaireBoard.shuffleDeck(state.deck);
        return {
            ...state,
            deck: shuffled
        }
    }),
    on(SolitaireActions.swapDeckElements, (state) => {
        let new_deck = SolitaireBoard.testSwapCardsFromDeck(state.deck, 3, 9);
        return {
            ...state,
            deck: new_deck
        }
    })
)