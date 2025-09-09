import { Profile } from "@sdk";
import { UserProfileModel } from "@sdk";

export function userProfileMapper(entity: Profile): UserProfileModel {
    return {
        id: entity.id,
        userId: entity.userId,
        name: entity.name,
        address: entity.address,
        mobile: entity.mobile,
        updatedAt: entity.updatedAt,
        imageUrl: entity.imageUrl,
    };
}
