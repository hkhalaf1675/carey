import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Car } from "./Car.entity";
import { User } from "./User.entity";

@Entity({
    name: 'rates'
})
export class Rate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'int',
        nullable: false
    })
    rate: string;

    @Column()
    comment: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Car, car => car.rates, { nullable: true, onDelete: 'SET NULL'})
    car: Car;

    @ManyToOne(() => User, user => user.rates, { nullable: true, onDelete: 'SET NULL'})
    user: User;
}
