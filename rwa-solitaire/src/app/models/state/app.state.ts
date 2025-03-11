import { AudioState } from "./audio.state";
import { LeaderboardsState } from "./leaderboards.state";
import { SolitaireState } from "./solitaire.state";
import { UserState } from "./user.state";

export interface AppState {
    audioState: AudioState;
    solitaireState: SolitaireState;
    userState: UserState;
    leaderboardsState: LeaderboardsState;
}