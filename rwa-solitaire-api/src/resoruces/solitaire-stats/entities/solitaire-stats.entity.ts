
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ColumnOptions, OneToOne, EntityOptions } from 'typeorm';


@Entity()
export class SolitaireStats {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    gamesPlayed: number;
  
    @Column({ default: 0 })
    totalWins: number;
  
    @Column({ type: 'float', default: 0 })
    averageSolveTime: number;
  
    @Column({ type: 'float', nullable: true })
    fastestSolveTime: number;
  
    // One-to-One relationship with User
    @OneToOne(() => User, (user) => user.solitaireStats)
    user: User;
}
