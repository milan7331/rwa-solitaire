import { SolitaireDifficulty } from "../solitaire/solitaire-difficulty";

export interface GameHistory {
    id: number;
    moves: number;
    gameWon: boolean;
    gameFinished: boolean;
    gameDifficulty: SolitaireDifficulty;
    startedTime: Date;
    finishedTime: Date;
    gameDurationInSeconds: number;
}
