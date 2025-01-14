import { User } from "src/resources/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum SolitaireDifficulty {
    Easy = 0,
    Hard = 1
}

@Entity()
export class GameHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @Column({ type: 'integer', default: 0 })
    moves: number;

    @Column({ type: 'boolean', default: false })
    gameWon: boolean;

    @Column({ type: 'boolean', default: false })
    gameFinished: boolean;

    @Column({ type: 'integer', default: 0 })
    gameDifficulty: SolitaireDifficulty;

    @Column({ type: 'timestamptz', nullable: true })
    startedTime: Date;

    @Column({ type: 'timestamptz', nullable: true })
    finishedTime: Date;

    @Column({ type: 'integer', nullable: true, default: 0})
    gameDurationInSeconds: number;

    @ManyToOne(() => User, (User) => User.gameHistory)
    @JoinColumn()
    user: User;

    @DeleteDateColumn()
    deletedAt?: Date;
}
