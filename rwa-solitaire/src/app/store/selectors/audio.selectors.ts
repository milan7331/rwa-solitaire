import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AudioState } from "../../models/state/audio.state";

export const selectAudioState = createFeatureSelector<AudioState>('audioState');

export const selectAudioVolume = createSelector(
    selectAudioState,
    (state: AudioState) => state.audioVolume
)

export const selectAudioMuted = createSelector(
    selectAudioState,
    (state: AudioState) => state.audioMuted
)