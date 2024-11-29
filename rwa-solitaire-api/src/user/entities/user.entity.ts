import { SavedGame } from 'src/saved-game/entities/saved-game.entity';
import { SolitaireStats } from 'src/solitaire-stats/entities/solitaire-stats.entity';
import { Entity, PrimaryGeneratedColumn, Column, ColumnOptions, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @OneToOne(() => SolitaireStats, (solitaireStats) => solitaireStats.user, { cascade: true })
    @JoinColumn()
    solitaireStats: SolitaireStats;

    @OneToOne(() => SavedGame, (savedGame) => savedGame.gameState, { cascade: true })
    @JoinColumn()
    savedGame: SavedGame;

}
