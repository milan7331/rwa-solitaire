import { SavedGame } from 'src/resources/saved-game/entities/saved-game.entity';
import { GameHistory } from 'src/resources/game-history/entities/game-history.entity';
import { UserStats } from 'src/resources/user-stats/entities/user-stats.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @Column({ unique: true, type: 'text' })
    username: string;

    @Column({ unique: true, type: 'text' })
    email: string;

    @Column({ type: 'text' })
    passwordHash: string;

    @Column({ type: 'text', default: '' })
    firstname: string;

    @Column({ type: 'text', default: '' })
    lastname: string;

    @OneToOne(() => UserStats, (UserStats) => UserStats.user, { cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    userStats: UserStats;

    @OneToMany(() => GameHistory, (GameHistory) => GameHistory.user, { cascade: true, onDelete: 'CASCADE' })
    gameHistory: GameHistory[];

    @OneToOne(() => SavedGame, (savedGame) => savedGame.gameState, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    savedGame: SavedGame;

    @DeleteDateColumn({ type: 'timestamptz' })
    deletedAt?: Date;
}