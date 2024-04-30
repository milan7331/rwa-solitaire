import { createAction, props } from "@ngrx/store";
import { Card } from "../../core/models/card";

export const initializeDeck = createAction("[Test category] Initialize Deck");

export const swapDeckElements = createAction("[Test category] Swap deck elements", props<{index1: number, index2: number}>());

export const shuffleDeck = createAction("[Test category] Shuffle deck");