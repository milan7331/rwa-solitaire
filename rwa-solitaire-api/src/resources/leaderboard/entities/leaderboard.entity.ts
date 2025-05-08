import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LeaderboardRow } from "./leaderboard.row";

@Entity()
export abstract class Leaderboard {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @Column({ type: 'timestamptz', unique: true })
    timePeriod: Date;

    @Column({ type: 'jsonb', default: []})
    top20_averageTime: LeaderboardRow[];

    @Column({ type: 'jsonb', default: []})
    top20_bestTime: LeaderboardRow[];

    @Column({ type: 'jsonb', default: []})
    top20_numberOfMoves: LeaderboardRow[];

    @Column({ type: 'jsonb', default: []})
    top20_gamesPlayed: LeaderboardRow[];

    @DeleteDateColumn({ type: 'timestamptz' })
    deletedAt: Date;
}
