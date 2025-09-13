import { Injectable } from "@nestjs/common";
import { Enum, User, UserPrivateInfo, UserPublicInfo, UserUpdate } from "@sdk";
import { ProfileService } from "./service/profile.service";
import { UserService } from "./service/user.service";
import { TransactionManager } from "@/infrastructure/_prisma/util/transaction.manager";

@Injectable()
export class UserFacade {
    constructor(
        private readonly txm: TransactionManager,
        private readonly userService: UserService,
        private readonly profileService: ProfileService
    ) {}

    /**
     * 내 정보 조회
     * - 프로필 포함
     */
    async getMyInfo(user: User): Promise<UserPrivateInfo> {
        const userWithProfile = await this.userService.getUserAndProfileById(
            user.id
        );

        return {
            id: userWithProfile.id,
            nickname: userWithProfile.nickname,
            imageUrl: userWithProfile.profile.imageUrl ?? null,
            role: userWithProfile.role as Enum.UserRole,
            profile: {
                name: userWithProfile.profile.name,
                mobile: userWithProfile.profile.mobile,
                address: userWithProfile.profile.address,
            },
        };
    }

    /**
     * 내 정보 업데이트
     */
    async updateMyInfo(user: User, input: UserUpdate): Promise<void> {
        await this.txm.transaction(async () => {
            const { nickname } = input;

            // 닉네임 업데이트 - 유저
            if (nickname) {
                await this.userService.updateNickname(user.id, nickname);
            }

            // 프로필 업데이트
            await this.profileService.updateProfile(user.id, input);
        });
    }

    /**
     * 유저 정보 조회 by ID
     */
    async getUserInfoById(id: string): Promise<UserPublicInfo> {
        const user = await this.userService.getUserAndProfileById(id);
        return {
            id: user.id,
            nickname: user.nickname,
            imageUrl: user.profile.imageUrl ?? null,
        };
    }

    /**
     * 유저 정보 조회 by 이메일
     */
    async getUserInfoByEmail(email: string): Promise<UserPublicInfo> {
        const user = await this.userService.getUserAndProfileByEmail(email);
        return {
            id: user.id,
            nickname: user.nickname,
            imageUrl: user.profile.imageUrl ?? null,
        };
    }
}
