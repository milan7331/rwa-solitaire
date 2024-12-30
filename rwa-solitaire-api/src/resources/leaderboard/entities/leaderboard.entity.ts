import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Leaderboard {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @Column()
    top20_averageTime: Record<string, number>[];

    @Column()
    top20_bestTime: Record<string, number>[];

    @Column()
    top20_numberOfMoves: Record<string, number>[];

    @Column()
    top20_gamesPlayed: Record<string, number>[];
}