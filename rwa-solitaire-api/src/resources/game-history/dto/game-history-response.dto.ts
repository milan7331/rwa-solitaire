import { SolitaireDifficulty } from "../entities/game-history.entity";

export interface GameHistoryResponseDto {
    id: number;
    moves: number;
    gameWon: boolean;
    gameFinished: boolean;
    gameDifficulty: SolitaireDifficulty;
    startedTime: Date;
    finishedTime: Date;
    gameDurationInSeconds: number;
}