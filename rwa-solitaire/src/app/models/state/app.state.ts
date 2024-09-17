import { SolitaireState } from "./solitaire.state";

export interface AppState {
    quickPlay: boolean;
    

    solitaire: SolitaireState;
}