
import { User } from 'src/resources/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ColumnOptions, OneToOne, EntityOptions, UpdateDateColumn, DeleteDateColumn, CreateDateColumn } from 'typeorm';


@Entity()
export class SolitaireStats {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date;

    @Column({ type:'number', default: 0 })
    gamesPlayed: number;
  
    @Column({ type:'number', default: 0 })
    gamesWon: number;

    // time is stored in seconds
    @Column({ type: 'interval', default: 0 })
    totalTimePlayed: number;
  
    // time is stored in seconds
    @Column({ type: 'interval', nullable: true })
    averageSolveTime: number;
  
    // time is stored in seconds
    @Column({ type: 'interval', nullable: true })
    fastestSolveTime: number;

    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
  
    @OneToOne(() => User, (user) => user.solitaireStats)
    user: User;

    @DeleteDateColumn()
    deletedAt?: Date;
}
