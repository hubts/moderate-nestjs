import { Injectable } from "@nestjs/common";
import { UserProfileModel } from "src/shared";
import { userProfileMapper } from "../../domain/mapper/user-profile.mapper";
import { ProfileRepository } from "../repository/profile.repository";

@Injectable()
export class ProfileCommandService {
    constructor(private readonly profileRepo: ProfileRepository) {}

    /**
     * Update mobile.
     * @param id - Profile ID.
     * @param mobile - New mobile.
     * @returns Updated profile information.
     */
    async updateMobile(id: string, mobile: string): Promise<UserProfileModel> {
        const updatedProfile = await this.profileRepo.updateProfileById(id, {
            mobile,
        });
        return userProfileMapper(updatedProfile);
    }

    /**
     * Update name.
     * @param id - Profile ID.
     * @param name - New name.
     * @returns Updated profile information.
     */
    async updateName(id: string, name: string): Promise<UserProfileModel> {
        const updatedProfile = await this.profileRepo.updateProfileById(id, {
            name,
        });
        return userProfileMapper(updatedProfile);
    }

    /**
     * Update address.
     * @param id - Profile ID.
     * @param address - New address.
     * @returns Updated profile information.
     */
    async updateAddress(
        id: string,
        address: string
    ): Promise<UserProfileModel> {
        const updatedProfile = await this.profileRepo.updateProfileById(id, {
            address,
        });
        return userProfileMapper(updatedProfile);
    }
}
