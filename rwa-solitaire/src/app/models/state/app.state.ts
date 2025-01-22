import { AudioState } from "./audio.state";
import { SolitaireState } from "./solitaire.state";
import { VisibilityState } from "./visibility.state";

export interface AppState {
    audioState: AudioState;
    visibilityState: VisibilityState;
    solitaireState: SolitaireState;
}