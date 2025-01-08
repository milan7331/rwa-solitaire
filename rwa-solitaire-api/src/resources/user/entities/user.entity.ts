import { SavedGame } from 'src/resources/saved-game/entities/saved-game.entity';
import { GameHistory } from 'src/resources/game-history/entities/game-history.entity';
import { UserStats } from 'src/resources/user-stats/entities/user-stats.entity';
import { Entity, PrimaryGeneratedColumn, Column, ColumnOptions, OneToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { HashService } from 'src/auth/hash.service';

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

    @OneToOne(() => UserStats, (UserStats) => UserStats.user, { cascade: true })
    @JoinColumn()
    UserStats: UserStats;

    @OneToMany(() => GameHistory, (GameHistory) => GameHistory.user, { cascade: ["remove", "soft-remove", "recover"] })
    GameHistory: GameHistory[];

    @OneToOne(() => SavedGame, (savedGame) => savedGame.gameState, { cascade: ["remove", "soft-remove", "recover"] })
    @JoinColumn()
    savedGame: SavedGame;

    @DeleteDateColumn({ type: 'timestamptz'})
    deletedAt?: Date;
}