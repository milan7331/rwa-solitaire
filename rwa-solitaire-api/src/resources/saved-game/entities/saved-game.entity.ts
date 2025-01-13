import { User } from "src/resources/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class SavedGame {
    
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'jsonb', nullable: true })
    gameState: Record<string, any>;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @OneToOne(() => User, (user) => user.savedGame)
    user: User;

    @DeleteDateColumn()
    deletedAt?: Date;
}
