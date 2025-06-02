import { CreateUserDto, UpdateUserDto, User, UserRole } from "@app/common";
import { SocialMediaEntity } from "apps/auth/src/users/entities";
import { UserEntity } from "apps/auth/src/users/entities/user.entity";
import { UserRoleEntity } from "apps/auth/src/users/enum";

export class UserMapper {
    static toGrpc(entity: UserEntity): User {
        return {
            id: entity.id,
            username: entity.username,
            age: entity.age,
            isActive: entity.isActive,
            role: this.mapEntityToProtoRole(entity.role),
            socialMedia: entity.socialMedia
                ? {
                    email: entity.socialMedia.email,
                    phone: entity.socialMedia.phone,
                    fbUri: entity.socialMedia.fbUri,
                    twitterUri: entity.socialMedia.twitterUri,
                }
                : undefined,
        };
    }

    static toEntity(dto: CreateUserDto): UserEntity {
        const user = new UserEntity();
        user.username = dto.username;
        user.password = dto.password;
        user.age = dto.age;
        user.role = this.mapProtoToEntityRole(dto.role);
        user.isActive = true;

        if (dto.socialMedia) {
            const sm = new SocialMediaEntity();
            sm.email = dto.socialMedia.email;
            sm.phone = dto.socialMedia.phone;
            sm.fbUri = dto.socialMedia.fbUri;
            sm.twitterUri = dto.socialMedia.twitterUri;

            sm.user = user;
            user.socialMedia = sm;
        }

        return user;
    }
    static mapProtoToEntityRole(protoRole: UserRole): UserRoleEntity {
        switch (protoRole) {
            case UserRole.ADMIN:
                return UserRoleEntity.ADMIN;
            case UserRole.MODERATOR:
                return UserRoleEntity.MODERATOR;
            case UserRole.MEMBER:
            default:
                return UserRoleEntity.MEMBER;
        }
    }
    static mapEntityToProtoRole(entityRole: UserRoleEntity): UserRole {
        switch (entityRole) {
            case UserRoleEntity.ADMIN:
                return UserRole.ADMIN;
            case UserRoleEntity.MODERATOR:
                return UserRole.MODERATOR;
            case UserRoleEntity.MEMBER:
            default:
                return UserRole.MEMBER;
        }
    }

}