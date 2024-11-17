import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./Role.entity";
import { PinCode } from "./PinCode.entity";
import { Car } from "./Car.entity";
import { Rate } from "./Rate.entity";

@Entity({
    name: 'users'
})
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: true,
        unique: true
    })
    LoginAppId: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    fullName: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    nickName: string;

    @Column({
        type: 'varchar',
        nullable: true,
        unique: true
    })
    email: string;

    @Column({
        type: 'varchar',
        nullable: true,
        unique: true
    })
    phone: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    address: string;

    @Column({
        type: 'varchar',
        nullable: false
    })
    password: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    pinCode: string;

    @Column({
        type: 'text',
        nullable: true
    })
    picture: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    gender: string;

    @Column({
        type: 'boolean',
        nullable: false,
        default: false
    })
    emailVerified: Boolean;

    @Column({
        type: 'boolean',
        nullable: false,
        default: false
    })
    phoneVerified: Boolean;

    @Column({
        type: 'boolean',
        nullable: false,
        default: false
    })
    biometricVerified: Boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => Role, (role) => role.users)
    role: Role;

    @OneToMany((type) => PinCode, pin => pin.user)
    pins: PinCode[];

    @OneToMany(() => Car, car => car.brand, { nullable: false, onDelete: 'CASCADE'})
    cars: Car[];

    @OneToMany(() => Rate, rate => rate.user, { nullable: true, onDelete: 'SET NULL'})
    rates: Rate[];
}