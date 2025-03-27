import { Injectable } from "@nestjs/common";
import { UserModel } from "@sdk";
import { userProfileMapper } from "../../domain/mapper/user-profile.mapper";
import { userMapper } from "../../domain/mapper/user.mapper";
import { ProfileRepository } from "../repository/profile.repository";
import { UserRepository } from "../repository/user.repository";
import { ExpectedErrorException } from "src/common/error/expected-error.exception";

@Injectable()
export class UserQueryService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly profileRepo: ProfileRepository
    ) {}

    /**
     * Check if there is a duplicate user.
     * @param where - User unique information to find.
     * @returns Whether the user exists and the reason for the duplication.
     */
    async existsBy(where: {
        email: string;
        nickname: string;
        mobile: string;
        name: string;
    }): Promise<{
        exists: boolean;
        reason: "email" | "nickname" | "mobile" | "name" | null;
    }> {
        const { email, nickname, mobile, name } = where;
        const users = await this.userRepo.findManyUsersByUnique({
            email,
            nickname,
            mobile,
            name,
        });
        if (!users.length) {
            return {
                exists: false,
                reason: null,
            };
        }

        const flat = users.map(user => ({
            email: user.email,
            nickname: user.nickname,
            mobile: user.Profile?.mobile ?? null,
            name: user.Profile?.name ?? null,
        }));
        return {
            exists: true,
            reason: flat.find(user => user.email === email)
                ? "email"
                : flat.find(user => user.nickname === nickname)
                ? "nickname"
                : flat.find(user => user.mobile === mobile)
                ? "mobile"
                : flat.find(user => user.name === name)
                ? "name"
                : null,
        };
    }

    /**
     * Get user by ID.
     * @param id - User ID.
     * @returns User information if found, otherwise an error.
     */
    async getUserById(id: string): Promise<UserModel> {
        const user = await this.userRepo.findUserByUnique({ id });
        if (!user) {
            throw new ExpectedErrorException("USER_NOT_FOUND", {
                case: "존재하지 않는 ID를 입력한 경우",
                id,
            });
        }
        return userMapper(user);
    }

    /**
     * Get user by email.
     * @param email - User email.
     * @returns User information if found, otherwise an error.
     */
    async getUserByEmail(email: string): Promise<UserModel> {
        const user = await this.userRepo.findUserByUnique({ email });
        if (!user) {
            throw new ExpectedErrorException("USER_NOT_FOUND", {
                case: "존재하지 않는 ID를 입력한 경우",
                email,
            });
        }
        return userMapper(user);
    }

    /**
     * Get user with profile by ID.
     * @param id - User ID.
     * @returns User and profile information if found, otherwise an error.
     */
    async getUserWithProfileById(id: string): Promise<UserModel> {
        const user = await this.getUserById(id);
        const profile = await this.profileRepo.findProfileByUnique({
            userId: user.id,
        });
        if (!profile) {
            throw new ExpectedErrorException("PROFILE_NOT_FOUND", {
                case: "존재하지 않는 프로필을 조회한 경우",
                userId: user.id,
            });
        }
        return {
            ...user,
            profile: userProfileMapper(profile),
        };
    }
}
