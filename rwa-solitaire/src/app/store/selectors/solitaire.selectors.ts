import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SolitaireState } from "../../models/state/solitaire.state";
import { boardAdapter, cardAdapter } from "../reducers/game.reducer";
import { GameState } from "../../models/state/game.state";

const selectSolitaireState = createFeatureSelector<SolitaireState>('solitaireState');

const selectGameState = createSelector(
    selectSolitaireState,
    (state: SolitaireState) => state.gameState
)

const selectCardsState = createSelector(
    selectGameState,
    (state: GameState) => state.cards
);

const selectBoardsState = createSelector(
  selectGameState,
  (state: GameState) => state.boards
);

const { selectAll: selectCardsAll } = cardAdapter.getSelectors(selectCardsState);

export const selectCards = createSelector(
    selectCardsAll,
    (cards) => cards
);

export const selectBoard = createSelector(
    selectBoardsState,
    (boards) => {
        const { ids, entities } = boards;

        const lastId = (ids.length > 0) ? ids.at(-1) : undefined;
        return (lastId !== undefined) ? entities[lastId] : undefined;
    }
);