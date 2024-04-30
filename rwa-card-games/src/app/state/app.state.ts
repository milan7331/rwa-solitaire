import { CoreState } from "../core/models/core-state";
import { SolitaireState } from "../solitaire/state/solitaire.state";


export interface AppState {
    //coreState: CoreState;
    solitaireState: SolitaireState;
}