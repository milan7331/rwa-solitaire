import { createReducer, on } from "@ngrx/store";
import { AudioState } from "../../models/state/audio.state";
import { audioActions } from "../actions/audio.actions";

const initialAudioState: AudioState = {
    audioVolume: 0.8,
    audioMuted: false,
};

const volumeChangeHandlers = [
    on(audioActions.setVolume, (state: AudioState, { value }) => ({
        ...state,
        audioVolume: Math.max(0.00, Math.min(value, 1.00)),
    })),
];

const  muteHandlers = [
    on(audioActions.mute, (state: AudioState) => ({
        ...state,
        audioMuted: true,
    })),
    on(audioActions.unmute, (state: AudioState) => ({
        ...state,
        audioMuted: false,
    })),
    on(audioActions.toggleMute, (state: AudioState) => ({
        ...state,
        audioMuted: !state.audioMuted,
    })),
];

export const audioReducer = createReducer(
    initialAudioState,
    ...volumeChangeHandlers,    
    ...muteHandlers,
);
