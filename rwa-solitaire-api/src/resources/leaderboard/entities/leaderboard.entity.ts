import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserData } from "../entities/userdata";

@Entity()
@Index('timePeriod', { unique: true })
export abstract class Leaderboard {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @Column({ type: 'timestamptz', unique: true })
    timePeriod: Date;

    @Column()
    top20_averageTime: UserData[];

    @Column()
    top20_bestTime: UserData[];

    @Column()
    top20_numberOfMoves: UserData[];

    @Column()
    top20_gamesPlayed: UserData[];

    @DeleteDateColumn({ type: 'timestamptz' })
    deletedAt: Date;
}