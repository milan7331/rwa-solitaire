import { LeaderboardRow } from "./leaderboard.row";

export interface Leaderboard {
    timePeriod: Date;

    top20_averageTime: LeaderboardRow[];
    top20_bestTime: LeaderboardRow[];
    top20_numberOfMoves: LeaderboardRow[];
    top20_gamesPlayed: LeaderboardRow[];
}

export interface WeeklyLeaderboard extends Leaderboard { }

export interface MonthlyLeaderboard extends Leaderboard { }

export interface YearlyLeaderboard extends Leaderboard { }

export const avgtime: LeaderboardRow[] = [
    { username: 'player1Avg', totalGames: 5, leastMoves: 8, totalDuration: 500, bestTime: 30, gamesWon: 3 },
    { username: 'player2', totalGames: 6, leastMoves: 9, totalDuration: 600, bestTime: 32, gamesWon: 4 },
    { username: 'player3', totalGames: 7, leastMoves: 10, totalDuration: 700, bestTime: 34, gamesWon: 5 },
    { username: 'player4', totalGames: 8, leastMoves: 11, totalDuration: 800, bestTime: 36, gamesWon: 6 },
    { username: 'player5', totalGames: 9, leastMoves: 12, totalDuration: 900, bestTime: 38, gamesWon: 7 },
    { username: 'player6', totalGames: 10, leastMoves: 13, totalDuration: 1000, bestTime: 40, gamesWon: 8 },
    { username: 'player7', totalGames: 11, leastMoves: 14, totalDuration: 1100, bestTime: 42, gamesWon: 9 },
    { username: 'player8', totalGames: 12, leastMoves: 15, totalDuration: 1200, bestTime: 44, gamesWon: 10 },
    { username: 'player9', totalGames: 13, leastMoves: 16, totalDuration: 1300, bestTime: 46, gamesWon: 11 },
    { username: 'player10', totalGames: 14, leastMoves: 17, totalDuration: 1400, bestTime: 48, gamesWon: 12 },
    { username: 'player11', totalGames: 15, leastMoves: 18, totalDuration: 1500, bestTime: 50, gamesWon: 13 },
    { username: 'player12', totalGames: 16, leastMoves: 19, totalDuration: 1600, bestTime: 52, gamesWon: 14 },
    { username: 'player13', totalGames: 17, leastMoves: 20, totalDuration: 1700, bestTime: 54, gamesWon: 15 },
    { username: 'player14', totalGames: 18, leastMoves: 21, totalDuration: 1800, bestTime: 56, gamesWon: 16 },
    { username: 'player15', totalGames: 19, leastMoves: 22, totalDuration: 1900, bestTime: 58, gamesWon: 17 },
    { username: 'player16', totalGames: 20, leastMoves: 23, totalDuration: 2000, bestTime: 60, gamesWon: 18 },
    { username: 'player17', totalGames: 21, leastMoves: 24, totalDuration: 2100, bestTime: 62, gamesWon: 19 },
    { username: 'player18', totalGames: 22, leastMoves: 25, totalDuration: 2200, bestTime: 64, gamesWon: 20 },
    { username: 'player19', totalGames: 23, leastMoves: 26, totalDuration: 2300, bestTime: 66, gamesWon: 21 },
    { username: 'player20', totalGames: 24, leastMoves: 27, totalDuration: 2400, bestTime: 68, gamesWon: 22 }
];

export const bstTime: LeaderboardRow[] = [
    { username: 'player1Bst', totalGames: 5, leastMoves: 8, totalDuration: 500, bestTime: 30, gamesWon: 3 },
    { username: 'player2', totalGames: 6, leastMoves: 9, totalDuration: 600, bestTime: 32, gamesWon: 4 },
    { username: 'player3', totalGames: 7, leastMoves: 10, totalDuration: 700, bestTime: 34, gamesWon: 5 },
    { username: 'player4', totalGames: 8, leastMoves: 11, totalDuration: 800, bestTime: 36, gamesWon: 6 },
    { username: 'player5', totalGames: 9, leastMoves: 12, totalDuration: 900, bestTime: 38, gamesWon: 7 },
    { username: 'player6', totalGames: 10, leastMoves: 13, totalDuration: 1000, bestTime: 40, gamesWon: 8 },
    { username: 'player7', totalGames: 11, leastMoves: 14, totalDuration: 1100, bestTime: 42, gamesWon: 9 },
    { username: 'player8', totalGames: 12, leastMoves: 15, totalDuration: 1200, bestTime: 44, gamesWon: 10 },
    { username: 'player9', totalGames: 13, leastMoves: 16, totalDuration: 1300, bestTime: 46, gamesWon: 11 },
    { username: 'player10', totalGames: 14, leastMoves: 17, totalDuration: 1400, bestTime: 48, gamesWon: 12 },
    { username: 'player11', totalGames: 15, leastMoves: 18, totalDuration: 1500, bestTime: 50, gamesWon: 13 },
    { username: 'player12', totalGames: 16, leastMoves: 19, totalDuration: 1600, bestTime: 52, gamesWon: 14 },
    { username: 'player13', totalGames: 17, leastMoves: 20, totalDuration: 1700, bestTime: 54, gamesWon: 15 },
    { username: 'player14', totalGames: 18, leastMoves: 21, totalDuration: 1800, bestTime: 56, gamesWon: 16 },
    { username: 'player15', totalGames: 19, leastMoves: 22, totalDuration: 1900, bestTime: 58, gamesWon: 17 },
    { username: 'player16', totalGames: 20, leastMoves: 23, totalDuration: 2000, bestTime: 60, gamesWon: 18 },
    { username: 'player17', totalGames: 21, leastMoves: 24, totalDuration: 2100, bestTime: 62, gamesWon: 19 },
    { username: 'player18', totalGames: 22, leastMoves: 25, totalDuration: 2200, bestTime: 64, gamesWon: 20 },
    { username: 'player19', totalGames: 23, leastMoves: 26, totalDuration: 2300, bestTime: 66, gamesWon: 21 },
    { username: 'player20', totalGames: 24, leastMoves: 27, totalDuration: 2400, bestTime: 68, gamesWon: 22 }
];

export const nom: LeaderboardRow[] = [
    { username: 'player1Nom', totalGames: 5, leastMoves: 8, totalDuration: 500, bestTime: 30, gamesWon: 3 },
    { username: 'player2', totalGames: 6, leastMoves: 9, totalDuration: 600, bestTime: 32, gamesWon: 4 },
    { username: 'player3', totalGames: 7, leastMoves: 10, totalDuration: 700, bestTime: 34, gamesWon: 5 },
    { username: 'player4', totalGames: 8, leastMoves: 11, totalDuration: 800, bestTime: 36, gamesWon: 6 },
    { username: 'player5', totalGames: 9, leastMoves: 12, totalDuration: 900, bestTime: 38, gamesWon: 7 },
    { username: 'player6', totalGames: 10, leastMoves: 13, totalDuration: 1000, bestTime: 40, gamesWon: 8 },
    { username: 'player7', totalGames: 11, leastMoves: 14, totalDuration: 1100, bestTime: 42, gamesWon: 9 },
    { username: 'player8', totalGames: 12, leastMoves: 15, totalDuration: 1200, bestTime: 44, gamesWon: 10 },
    { username: 'player9', totalGames: 13, leastMoves: 16, totalDuration: 1300, bestTime: 46, gamesWon: 11 },
    { username: 'player10', totalGames: 14, leastMoves: 17, totalDuration: 1400, bestTime: 48, gamesWon: 12 },
    { username: 'player11', totalGames: 15, leastMoves: 18, totalDuration: 1500, bestTime: 50, gamesWon: 13 },
    { username: 'player12', totalGames: 16, leastMoves: 19, totalDuration: 1600, bestTime: 52, gamesWon: 14 },
    { username: 'player13', totalGames: 17, leastMoves: 20, totalDuration: 1700, bestTime: 54, gamesWon: 15 },
    { username: 'player14', totalGames: 18, leastMoves: 21, totalDuration: 1800, bestTime: 56, gamesWon: 16 },
    { username: 'player15', totalGames: 19, leastMoves: 22, totalDuration: 1900, bestTime: 58, gamesWon: 17 },
    { username: 'player16', totalGames: 20, leastMoves: 23, totalDuration: 2000, bestTime: 60, gamesWon: 18 },
    { username: 'player17', totalGames: 21, leastMoves: 24, totalDuration: 2100, bestTime: 62, gamesWon: 19 },
    { username: 'player18', totalGames: 22, leastMoves: 25, totalDuration: 2200, bestTime: 64, gamesWon: 20 },
    { username: 'player19', totalGames: 23, leastMoves: 26, totalDuration: 2300, bestTime: 66, gamesWon: 21 },
    { username: 'player20', totalGames: 24, leastMoves: 27, totalDuration: 2400, bestTime: 68, gamesWon: 22 }
];

export const gsp: LeaderboardRow[] = [
    { username: 'player1GSP', totalGames: 5, leastMoves: 8, totalDuration: 500, bestTime: 30, gamesWon: 3 },
    { username: 'player2', totalGames: 6, leastMoves: 9, totalDuration: 600, bestTime: 32, gamesWon: 4 },
    { username: 'player3', totalGames: 7, leastMoves: 10, totalDuration: 700, bestTime: 34, gamesWon: 5 },
    { username: 'player4', totalGames: 8, leastMoves: 11, totalDuration: 800, bestTime: 36, gamesWon: 6 },
    { username: 'player5', totalGames: 9, leastMoves: 12, totalDuration: 900, bestTime: 38, gamesWon: 7 },
    { username: 'player6', totalGames: 10, leastMoves: 13, totalDuration: 1000, bestTime: 40, gamesWon: 8 },
    { username: 'player7', totalGames: 11, leastMoves: 14, totalDuration: 1100, bestTime: 42, gamesWon: 9 },
    { username: 'player8', totalGames: 12, leastMoves: 15, totalDuration: 1200, bestTime: 44, gamesWon: 10 },
    { username: 'player9', totalGames: 13, leastMoves: 16, totalDuration: 1300, bestTime: 46, gamesWon: 11 },
    { username: 'player10', totalGames: 14, leastMoves: 17, totalDuration: 1400, bestTime: 48, gamesWon: 12 },
    { username: 'player11', totalGames: 15, leastMoves: 18, totalDuration: 1500, bestTime: 50, gamesWon: 13 },
    { username: 'player12', totalGames: 16, leastMoves: 19, totalDuration: 1600, bestTime: 52, gamesWon: 14 },
    { username: 'player13', totalGames: 17, leastMoves: 20, totalDuration: 1700, bestTime: 54, gamesWon: 15 },
    { username: 'player14', totalGames: 18, leastMoves: 21, totalDuration: 1800, bestTime: 56, gamesWon: 16 },
    { username: 'player15', totalGames: 19, leastMoves: 22, totalDuration: 1900, bestTime: 58, gamesWon: 17 },
    { username: 'player16', totalGames: 20, leastMoves: 23, totalDuration: 2000, bestTime: 60, gamesWon: 18 },
    { username: 'player17', totalGames: 21, leastMoves: 24, totalDuration: 2100, bestTime: 62, gamesWon: 19 },
    { username: 'player18', totalGames: 22, leastMoves: 25, totalDuration: 2200, bestTime: 64, gamesWon: 20 },
    { username: 'player19', totalGames: 23, leastMoves: 26, totalDuration: 2300, bestTime: 66, gamesWon: 21 },
    { username: 'player20', totalGames: 24, leastMoves: 27, totalDuration: 2400, bestTime: 68, gamesWon: 22 }
];


export const lboard: Leaderboard  = {
    timePeriod: new Date(),
    top20_averageTime: avgtime,
    top20_bestTime: bstTime,
    top20_numberOfMoves: nom,
    top20_gamesPlayed: gsp,
};
