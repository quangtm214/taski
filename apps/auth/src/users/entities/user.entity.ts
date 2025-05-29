import { SocialMediaEntity } from 'apps/auth/src/users/entities/social-media.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    age: number;

    @Column({ default: true })
    isActive: boolean;

    @OneToOne(() => SocialMediaEntity, sm => sm.user, { cascade: true, eager: true })
    socialMedia: SocialMediaEntity;
}