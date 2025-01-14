import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserData } from "../entities/userdata";

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
    top20_averageTime: UserData[];

    @Column({ type: 'jsonb', default: []})
    top20_bestTime: UserData[];

    @Column({ type: 'jsonb', default: []})
    top20_numberOfMoves: UserData[];

    @Column({ type: 'jsonb', default: []})
    top20_gamesPlayed: UserData[];

    @DeleteDateColumn({ type: 'timestamptz' })
    deletedAt: Date;
}