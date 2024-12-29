import { User } from "src/resoruces/user/entities/user.entity";
import { Column, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class SavedGame {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb', nullable: true })
    gameState: Record<string, any>;

    @UpdateDateColumn({ type: 'timestamptz' })
    lastUpdated: Date;

    @OneToOne(() => User, (user) => user.savedGame)
    user: User;

    @DeleteDateColumn()
    deletedAt?: Date;
}
