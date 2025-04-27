import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AudioState } from "../../models/state/audio.state";

export const selectAudioState = createFeatureSelector<AudioState>('audioState');

export const selectAudioVolume = createSelector(
    selectAudioState,
    (state: AudioState) => state.audioVolume
);

export const selectAudioMuted = createSelector(
    selectAudioState,
    (state: AudioState) => state.audioMuted
);

export const selectAudioVolumeIcon = createSelector(
    selectAudioVolume,
    selectAudioMuted,
    (volume: number, muted: boolean) => {
        if (muted) return 'volume_off';
        if (volume === 0) return 'volume_muted';
        if (volume > 0 && volume <= 0.5) return 'volume_down';
        return 'volume_up';
    } 
)
