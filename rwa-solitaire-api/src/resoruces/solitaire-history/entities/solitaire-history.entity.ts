import { User } from "src/resoruces/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum SolitaireDifficulty {
    Easy = 0,
    Hard = 1
}

@Entity()
export class SolitaireHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: 'timestamptz'})
    gameStartedAt: number;

    @UpdateDateColumn({type: 'timestamptz'})
    gameLastUpdatedAt: number;

    @Column({type: 'integer', default: 0})
    moves: number;

    @Column({type: 'boolean', default: false})
    gameWon: boolean;

    @Column({type: 'boolean', default: false})
    gameFinished: boolean;

    @Column({type: 'integer', default: 0})
    gameDifficulty: SolitaireDifficulty;

    @ManyToOne(() => User, (User) => User.solitaireHistory)
    @JoinColumn()
    user: User;

    @DeleteDateColumn()
    deletedAt?: Date;
}
