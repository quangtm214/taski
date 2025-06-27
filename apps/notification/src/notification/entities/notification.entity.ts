import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('notification')
export class NotificationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    message: string;

    @Column({ default: false })
    isRead: boolean;

}