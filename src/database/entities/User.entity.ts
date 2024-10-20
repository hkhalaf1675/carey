import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./Role.entity";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => Role, (role) => role.users)
    role: Role;
}