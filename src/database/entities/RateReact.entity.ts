import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User.entity";
import { Rate } from "./Rate.entity";

@Entity({
    name: 'ratereacts'
})
export class RateReact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: false
    })
    react: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Rate, rate => rate.reacts, { nullable: true, onDelete: 'SET NULL'})
    rate: Rate;

    @ManyToOne(() => User, user => user.rates, { nullable: true, onDelete: 'SET NULL'})
    user: User;
}
