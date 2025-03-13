
import { User } from 'src/resources/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, UpdateDateColumn, DeleteDateColumn, CreateDateColumn } from 'typeorm';


@Entity()
export class UserStats {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date;

    @Column({ type:'integer', default: 0 })
    gamesPlayed: number;
  
    @Column({ type:'integer', default: 0 })
    gamesWon: number;

    // time is stored in seconds
    @Column({ type: 'integer', default: 0 })
    totalTimePlayed: number;
  
    // time is stored in seconds
    @Column({ type: 'integer', nullable: true })
    averageSolveTime: number;
  
    // time is stored in seconds
    @Column({ type: 'integer', nullable: true })
    fastestSolveTime: number;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  
    @OneToOne(() => User, (user) => user.userStats)
    user: User;

    @DeleteDateColumn({ type: 'timestamptz' })
    deletedAt?: Date;
}
