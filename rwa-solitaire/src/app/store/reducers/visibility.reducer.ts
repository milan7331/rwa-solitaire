import { createReducer, on } from "@ngrx/store"
import { VisibilityState } from "../../models/state/visibility.state"
import { visibilityActions } from "../actions/visibility.actions"


export const initialVisibilityState: VisibilityState = {
    showAudioControl: false,
    showHint: false,
    showAboutPage: false
}

export const visibilityReducer = createReducer(
    initialVisibilityState,
    on(visibilityActions.showAudioControls, (state) => ({
        ...state,
        showAudioControl: true
    })),
    on(visibilityActions.hideAudioControls, (state) => ({
        ...state,
        showAudioControl: false
    })),
    on(visibilityActions.toggleAudioControls, (state) => ({
        ...state,
        showAudioControl: !state.showAudioControl
    })),
    on(visibilityActions.showHint, (state) => ({
        ...state,
        showHint: !state.showHint
    })),
    on(visibilityActions.showAboutPage, (state) => ({
        ...state,
        showAboutPage: true
    })),
    on(visibilityActions.hideAboutPage, (state) => ({
        ...state,
        showAboutPage: false
    })),
    on(visibilityActions.toggleAboutPage, (state) => ({
        ...state,
        showAboutPage: !state.showAboutPage
    }))
)