import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Car } from "./Car.entity";

@Entity({
    name: 'offers'
})
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'int',
        nullable: false
    })
    discount: string;

    @Column({
        type: 'varchar',
        nullable: false
    })
    type: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    description?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Car, car => car.offers, { nullable: false, onDelete: 'CASCADE'})
    car: Car;
}
