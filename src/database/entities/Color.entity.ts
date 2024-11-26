import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Car } from "./Car.entity";

@Entity({
    name: 'colors'
})
export class Color {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: false
    })
    name: string;

    @Column({
        nullable: false,
        default: true
    })
    isAvailable: Boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Car, car => car.colors, { nullable: false, onDelete: 'CASCADE'})
    car: Car;
}
