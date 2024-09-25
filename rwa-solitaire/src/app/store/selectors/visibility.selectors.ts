import { createFeatureSelector, createSelector } from "@ngrx/store";
import { VisibilityState } from "../../models/state/visibility.state";

export const selectComponentVisibility = createFeatureSelector<VisibilityState>("visibiltyState");

export const selectAudioControlVisibility = createSelector(
    selectComponentVisibility,
    (visibility) => visibility.showAudioControl
)