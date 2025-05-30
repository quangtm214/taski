import { SocialMediaEntity } from 'apps/auth/src/users/entities/social-media.entity';
import { UserRoleEntity } from '../enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    age: number;

    @Column(
        {
            type: 'enum',
            enum: UserRoleEntity,
            default: UserRoleEntity.MEMBER
        }
    )
    role: UserRoleEntity

    @Column({ default: true })
    isActive: boolean;

    @OneToOne(() => SocialMediaEntity, sm => sm.user, { cascade: true, eager: true })
    socialMedia: SocialMediaEntity;
}