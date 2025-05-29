import { UserEntity } from 'apps/auth/src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('social_media')
export class SocialMediaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column({ nullable: true })
    fbUri?: string;

    @Column({ nullable: true })
    twitterUri?: string;

    @OneToOne(() => UserEntity, user => user.socialMedia)
    @JoinColumn()
    user: UserEntity;
}