import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SolitaireState } from "../../models/state/solitaire.state";
import { boardAdapter } from "../reducers/solitaire.reducer";
import { SolitaireDifficulty } from "../../models/solitaire/solitaire-difficulty";

const selectSolitaireState = createFeatureSelector<SolitaireState>('solitaireState');

const selectBoardsState = createSelector(
  selectSolitaireState,
  (state: SolitaireState) => state.boards
);

export const selectGameEndConditionState = createSelector(
    selectSolitaireState,
    (state: SolitaireState) => state.winCondition
)

const { selectTotal: selectBoardsTotal } = boardAdapter.getSelectors(selectBoardsState);

export const selectBoard = createSelector(
    selectBoardsState,
    (boards) => {
        const { ids, entities } = boards;

        const lastId = (ids.length > 0) ? ids.at(-1) : undefined;
        return (lastId !== undefined) ? entities[lastId] : undefined;
    }
);

export const selectGameDifficulty = createSelector(
    selectBoard,
    (board) => board?.difficulty
)

export const selectUndoAvailability = createSelector(
    selectBoardsTotal,
    (total) => {
        return (total > 1)? true : false;
    }
)


// import { createFeatureSelector, createSelector } from "@ngrx/store";
// import { SolitaireState } from "../../models/state/solitaire.state";
// import { boardAdapter, cardAdapter } from "../reducers/solitaire.reducer";
// import { SolitaireDifficulty } from "../../models/solitaire/solitaire-board";

// const selectSolitaireState = createFeatureSelector<SolitaireState>('solitaireState');

// const selectCardsState = createSelector(
//     selectSolitaireState,
//     (state: SolitaireState) => state.cards
// );

// const selectBoardsState = createSelector(
//   selectSolitaireState,
//   (state: SolitaireState) => state.boards
// );

// export const selectGameEndState = createSelector(
//     selectSolitaireState,
//     (state: SolitaireState) => state.winCondition
// )

// const { selectAll: selectCardsAll } = cardAdapter.getSelectors(selectCardsState);
// const { selectTotal: selectBoardsTotal } = boardAdapter.getSelectors(selectBoardsState);


// export const selectCards = createSelector(
//     selectCardsAll,
//     (cards) => cards
// );

// export const selectBoard = createSelector(
//     selectBoardsState,
//     (boards) => {
//         const { ids, entities } = boards;

//         const lastId = (ids.length > 0) ? ids.at(-1) : undefined;
//         return (lastId !== undefined) ? entities[lastId] : undefined;
//     }
// );

// export const selectGameDifficulty = createSelector(
//     selectBoard,
//     (board) => board?.difficulty
// )

// export const selectUndoAvailability = createSelector(
//     selectBoardsTotal,
//     (total) => {
//         return (total > 1)? true : false;
//     }
// )