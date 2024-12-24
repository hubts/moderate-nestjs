import { Injectable } from "@nestjs/common";
import { UserProfileModel } from "src/shared";
import { userProfileMapper } from "../../domain/mapper/user-profile.mapper";
import { ProfileRepository } from "../repository/profile.repository";
import { ExpectedErrorException } from "src/common/error/exception/expected-error.exception";

@Injectable()
export class ProfileQueryService {
    constructor(private readonly profileRepo: ProfileRepository) {}

    /**
     * Get profile by ID.
     * @param id - Profile ID.
     * @returns Profile information or error.
     */
    async getProfileById(id: string): Promise<UserProfileModel> {
        const profile = await this.profileRepo.findProfileByUnique({ id });
        if (!profile) {
            throw new ExpectedErrorException("PROFILE_NOT_FOUND", {
                case: "올바르지 않은 Profile ID",
                profileId: id,
            });
        }
        return userProfileMapper(profile);
    }

    /**
     * Get profile by user ID.
     * @param userId - User ID.
     * @returns Profile information or error.
     */
    async getProfileByUserId(userId: string): Promise<UserProfileModel> {
        const profile = await this.profileRepo.findProfileByUnique({ userId });
        if (!profile) {
            throw new ExpectedErrorException("PROFILE_NOT_FOUND", {
                case: "올바르지 않은 User ID",
                userId,
            });
        }
        return userProfileMapper(profile);
    }

    /**
     * Get profile by mobile.
     * @param mobile - User mobile.
     * @returns Profile information or error.
     */
    async getProfileByMobile(mobile: string): Promise<UserProfileModel> {
        const profile = await this.profileRepo.findProfileByUnique({ mobile });
        if (!profile) {
            throw new ExpectedErrorException("PROFILE_NOT_FOUND", {
                case: "올바르지 않은 Mobile",
                mobile,
            });
        }
        return userProfileMapper(profile);
    }
}
