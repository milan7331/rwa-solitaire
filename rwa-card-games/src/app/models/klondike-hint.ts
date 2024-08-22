import { KlondikeMove } from "./klondike-move";


export interface KlondikeHint {
    moves: KlondikeMove[],
    cycleDeck: boolean,
}