import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Car } from "./Car.entity";
import { User } from "./User.entity";
import { RateReact } from "./RateReact.entity";

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
    rate: number;

    @Column({
        type: 'varchar',
        nullable: true
    })
    comment?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Car, car => car.rates, { nullable: true, onDelete: 'SET NULL'})
    car: Car;

    @ManyToOne(() => User, user => user.rates, { nullable: true, onDelete: 'SET NULL'})
    user: User;

    @OneToMany(() => RateReact, react => react.rate, {nullable: true, onDelete: 'CASCADE'})
    reacts: RateReact[];
}
