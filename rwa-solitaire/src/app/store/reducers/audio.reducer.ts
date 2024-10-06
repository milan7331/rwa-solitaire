import { createReducer, on } from "@ngrx/store";
import { AudioState } from "../../models/state/audio.state";
import { volumeControlActions } from "../actions/audio.actions";

// dodati ono sranje za gornju granicu %%%%
// ispraviti nije baš dobro sa %

export const initialAudioState: AudioState = {
    audioVolume: 0.8,
    audioMuted: false
}

export const audioReducer = createReducer(
    initialAudioState,
    on(volumeControlActions.setVolume, (state, {value}) => ({
        ...state,
        audioVolume: Math.max(0.00, Math.min(value, 1.00))
    })),
    on(volumeControlActions.mute, (state) => ({
        ...state,
        audioMuted: true
    })),
    on(volumeControlActions.unmute, (state) => ({
        ...state,
        audioMuted: false
    })),
    on(volumeControlActions.toggleMute, (state) => ({
        ...state,
        audioMuted: !state.audioMuted
    }))
)