import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SolitaireState } from "../../models/state/solitaire.state";
import { boardAdapter, cardAdapter } from "../reducers/solitaire.reducer";

const selectSolitaireState = createFeatureSelector<SolitaireState>('solitaireState');

const {
    selectAll: selectCardsAll,
    // selectEntities: selectCardsEntities,
    // selectIds: selectCardsIds,
    // selectTotal: selectCardsTotal
} = cardAdapter.getSelectors((state: SolitaireState) => state.cards);

// const {
//     selectAll: selectBoardsAll,
//     selectEntities: selectBoardsEntities,
//     selectIds: selectBoardsIds,
//     selectTotal: selectBoardsTotal
// } = boardAdapter.getSelectors((state: SolitaireState) => state.boards);

export const selectCards = createSelector(
    selectSolitaireState,
    selectCardsAll
)


export const selectBoard = createSelector(
    selectSolitaireState,
    (state: SolitaireState) => {
        const lastId = state.boards.ids.length ? state.boards.ids[state.boards.ids.length - 1] : null;
        return lastId ? state.boards.entities[lastId] : null;
    }
)