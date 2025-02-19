import { createFeatureSelector, createSelector } from "@ngrx/store";
import { VisibilityState } from "../../models/state/visibility.state";

export const selectComponentVisibility = createFeatureSelector<VisibilityState>("visibilityState");

export const selectAudioControlVisibility = createSelector(
    selectComponentVisibility,
    (visibility) => visibility.showAudioControl
)

// treba implementirati
export const selectAboutPageVisibility = createSelector(
    selectComponentVisibility,
    (visibility) => visibility.showAboutPage
)