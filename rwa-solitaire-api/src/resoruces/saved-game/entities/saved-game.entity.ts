import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SavedGame {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb', nullable: true })
    gameState: any;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    lastUpdated: Date;

    @OneToOne(() => User, (user) => user.solitaireStats)
    user: User;
}
