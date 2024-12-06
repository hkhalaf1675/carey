import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Car } from "./Car.entity";
import { User } from "./User.entity";

@Entity({
    name: 'wishlists'
})
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Car, car => car.wishlists, { nullable: false, onDelete: 'CASCADE'})
    car: Car;

    @ManyToOne(() => User, user => user.wishlists, { nullable: false, onDelete: 'CASCADE'})
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
