
import { User } from 'src/resoruces/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ColumnOptions, OneToOne, EntityOptions, UpdateDateColumn, DeleteDateColumn } from 'typeorm';


@Entity()
export class SolitaireStats {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type:'number', default: 0 })
    gamesPlayed: number;
  
    @Column({ type:'number', default: 0 })
    gamesWon: number;

    @Column({ type: 'interval', default: 0 })
    totalTimePlayed: string;
  
    @Column({ type: 'interval', nullable: true })
    averageSolveTime: string;
  
    @Column({ type: 'interval', nullable: true })
    fastestSolveTime: string;

    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
  
    @OneToOne(() => User, (user) => user.solitaireStats)
    user: User;

    @DeleteDateColumn()
    deletedAt?: Date;
}
