import { createFeatureSelector, createSelector } from "@ngrx/store";
import { VisibilityState } from "../../models/state/visibility.state";

export const selectComponentVisibility = createFeatureSelector<VisibilityState>("visibilityState");

export const selectAudioControlVisibility = createSelector(
    selectComponentVisibility,
    (visibility) => visibility.showAudioControl
)

// ne koristi se??????
export const selectHintVisibility = createSelector(
    selectComponentVisibility,
    (visibility) => visibility.showHint
)

// treba implementirati
export const selectAboutPageVisibility = createSelector(
    selectComponentVisibility,
    (visibility) => visibility.showAboutPage
)