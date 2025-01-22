import { createSelector, createFeatureSelector } from "@ngrx/store";
import { AudioState } from "../../models/state/audio.state";

export const selectAudioState = createFeatureSelector<AudioState>('audioState');

export const selectAppVolume = createSelector(
    selectAudioState,
    (state: AudioState) => state.audioVolume
)

export const selectAppMuted = createSelector(
    selectAudioState,
    (state: AudioState) => state.audioMuted
)
