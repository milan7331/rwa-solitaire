import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SolitaireState } from "../../models/state/solitaire.state";
import { boardAdapter, cardAdapter } from "../reducers/solitaire.reducer";

const selectSolitaireState = createFeatureSelector<SolitaireState>('solitaireState');

const selectCardsState = createSelector(
    selectSolitaireState,
    (state: SolitaireState) => state.cards
);

const selectBoardsState = createSelector(
  selectSolitaireState,
  (state: SolitaireState) => state.boards
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