import { createSelector, createFeatureSelector } from "@ngrx/store";
import { AudioState } from "../../models/state/audio.state";

export const selectAppAudio = createFeatureSelector<AudioState>('audioState');

export const selectAppVolume = createSelector(
    selectAppAudio,
    (state: AudioState) => state.audioVolume
)

export const selectAppMuted = createSelector(
    selectAppAudio,
    (state: AudioState) => state.audioMuted
)
