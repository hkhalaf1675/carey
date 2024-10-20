import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'phoneverificationpin'
})
export class PhoneVerificationPin{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone: string;

    @Column()
    pin: string;

    @Column()
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}