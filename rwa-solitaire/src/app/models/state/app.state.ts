import { AudioState } from "./audio.state";
import { AuthState } from "./auth.state";
import { SolitaireState } from "./solitaire.state";
import { UserState } from "./user.state";
import { VisibilityState } from "./visibility.state";

export interface AppState {
    audioState: AudioState;
    visibilityState: VisibilityState;
    solitaireState: SolitaireState;
    userState: UserState;
    authState: AuthState;
}