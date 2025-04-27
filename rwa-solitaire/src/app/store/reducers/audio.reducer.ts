import { createReducer, on } from "@ngrx/store";
import { AudioState } from "../../models/state/audio.state";
import { audioActions } from "../actions/audio.actions";

export const initialAudioState: AudioState = {
    audioVolume: 0.8,
    audioMuted: false,
};

export const audioReducer = createReducer(
    initialAudioState,
    on(audioActions.setVolume, (state, { value }) => ({
        ...state,
        audioVolume: Math.max(0.00, Math.min(value, 1.00))
    })),
    on(audioActions.mute, (state) => ({
        ...state,
        audioMuted: true
    })),
    on(audioActions.unmute, (state) => ({
        ...state,
        audioMuted: false
    })),
    on(audioActions.toggleMute, (state) => ({
        ...state,
        audioMuted: !state.audioMuted
    })),
);
