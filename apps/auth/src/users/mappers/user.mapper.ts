import { CreateUserDto, UpdateUserDto, User } from "@app/common";
import { SocialMediaEntity } from "apps/auth/src/users/entities";
import { UserEntity } from "apps/auth/src/users/entities/user.entity";

export class UserMapper {
    static toGrpc(entity: UserEntity): User {
        return {
            id: entity.id,
            username: entity.username,
            password: entity.password,
            age: entity.age,
            isActive: entity.isActive,
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
    static toEntity(dto: CreateUserDto | User): UserEntity {
        const user = new UserEntity();
        user.username = dto.username;
        user.password = dto.password;
        user.age = dto.age;
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
}