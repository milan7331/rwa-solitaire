import { SavedGame } from 'src/resoruces/saved-game/entities/saved-game.entity';
import { SolitaireHistory } from 'src/resoruces/solitaire-history/entities/solitaire-history.entity';
import { SolitaireStats } from 'src/resoruces/solitaire-stats/entities/solitaire-stats.entity';
import { Entity, PrimaryGeneratedColumn, Column, ColumnOptions, OneToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

    @OneToOne(() => SolitaireStats, (solitaireStats) => solitaireStats.user, { cascade: true })
    @JoinColumn()
    solitaireStats: SolitaireStats;

    @OneToMany(() => SolitaireHistory, (solitaireHistory) => solitaireHistory.user, { cascade: false })
    solitaireHistory: SolitaireHistory[];

    @OneToOne(() => SavedGame, (savedGame) => savedGame.gameState, { cascade: true })
    @JoinColumn()
    savedGame: SavedGame;

}
