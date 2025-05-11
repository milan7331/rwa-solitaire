import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SolitaireState } from "../../models/state/solitaire.state";
import { boardAdapter } from "../reducers/solitaire.reducer";

const selectSolitaireState = createFeatureSelector<SolitaireState>('solitaireState');

const selectBoardsState = createSelector(
  selectSolitaireState,
  (state: SolitaireState) => state.boards
);

export const selectGameEndConditionState = createSelector(
    selectSolitaireState,
    (state: SolitaireState) => state.winCondition
);

export const selectGameDifficultyState = createSelector(
    selectSolitaireState,
    (state: SolitaireState) => state.difficulty
);

export const selectBoard = createSelector(
    selectBoardsState,
    (boards) => {
        const { ids, entities } = boards;
        
        const lastId = (ids.length >= 0) ? ids.at(-1) : undefined;
        return (lastId !== undefined) ? entities[lastId] : undefined;
    }
);

export const selectCurrentMoveNumber = createSelector(
    selectBoard,
    (board) => {
        return (board !== undefined) ? board.moveNumber : 0;
    }
);

const { selectTotal: selectBoardsTotal } = boardAdapter.getSelectors(selectBoardsState);

export const selectUndoAvailability = createSelector(
    selectBoardsTotal,
    (total) => {
        return (total > 1)? true : false;
    }
);
