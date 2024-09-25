import { AudioState } from "./audio.state";
import { VisibilityState } from "./visibility.state";

export interface AppState {
    audioState: AudioState,
    visibilityState: VisibilityState
    
}