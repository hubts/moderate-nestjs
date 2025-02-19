import { Profile, User, UserLoginHistory } from "@prisma/client";
import { UserModel } from "@sdk";
import { userLoginHistoryMapper } from "./user-login-history.mapper";
import { userProfileMapper } from "./user-profile.mapper";

export function userMapper(
    entity: User &
        Partial<{
            Profile: Profile;
            UserLoginHistories: UserLoginHistory[];
        }>
): UserModel {
    return {
        id: entity.id,
        email: entity.email,
        nickname: entity.nickname,
        joinedAt: entity.createdAt,
        role: entity.role,
        loginHistories:
            entity.UserLoginHistories?.map(userLoginHistoryMapper) ?? [],
        profile: entity.Profile ? userProfileMapper(entity.Profile) : null,
    };
}
