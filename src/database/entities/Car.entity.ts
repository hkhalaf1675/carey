import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Brand } from "./Brand.entity";
import { User } from "./User.entity";
import { Attachment } from "./Attachment.entity";
import { Rate } from "./Rate.entity";

@Entity({
    name: 'cars'
})
export class Car {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: false
    })
    name: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    type?: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    description?: string;

    @Column({
        nullable: false,
        type: 'decimal'
    })
    price: number;

    @Column({
        nullable: false,
        type: 'varchar',
        default: 'New'
    })
    status: string;

    @Column({
        nullable: false,
        type: 'bool',
        default: true
    })
    available: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Brand , brand => brand.cars, { nullable: true, onDelete: 'SET NULL'})
    brand: Brand;

    @ManyToOne(() => User , user => user.cars, { nullable: false, onDelete: 'CASCADE'})
    user: User;

    @OneToMany(() => Attachment, attachment => attachment.car, { nullable: false, onDelete: 'CASCADE'})
    attachments: Attachment[];

    @OneToMany(() => Rate, rate => rate.car, { nullable: true, onDelete: 'SET NULL'})
    rates: Rate[];
}
