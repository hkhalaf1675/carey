import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";

@Entity({
    name: 'notifications'
})
export class Notification{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: true
    })
    title: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    body: string;

    @Column({
        type: 'boolean',
        default: false
    })
    isSeen: boolean;

    @Column({
        type: 'json',
        nullable: true
    })
    data: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.notifications, {nullable: false, onDelete: 'CASCADE'})
    user: User;

    get timeElapsed(): string{
        const now = new Date();
        const elapsedMS = now.getTime() - this.createdAt.getTime();

        const seconds = Math.floor(elapsedMS / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if(days > 0){
            return `${days} day ago`;
        }
        else if(hours > 0){
            return `${hours} hour ago`;
        }
        else if(minutes > 0){
            return `${minutes} minute ago`;
        }
        else{
            return `${seconds} second ago`;
        }
    }
}