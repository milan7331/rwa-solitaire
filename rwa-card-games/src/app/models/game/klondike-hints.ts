import { KlondikeMove } from "./klondike-move";

export interface KlondikeHints {
    moves: KlondikeMove[],
    cycleDeck: boolean,
}