import { Injectable } from "@nestjs/common";

import { UserRepository } from "../repository/user.repository";
import { checkUserPropsExist } from "../domain/check-user-props-exist";
import { ReturnError } from "src/common/error/util/error";
import { userMapper } from "../mapper/user.mapper";
import { UserModel, UserProfileModel } from "src/shared/api/user/user.domain";
import { UserJoin } from "src/shared/api/auth/auth.api";
import { ProfileRepository } from "../repository/profile.repository";
import {
    checkUserPassword,
    hashUserPassword,
} from "../domain/user-password-manager";
import { userProfileMapper } from "../mapper/user-profile.mapper";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly profileRepo: ProfileRepository
    ) {}

    /**
     * User 정보를 요약하여 출력합니다.
     * @param user - User 객체
     * @returns User 정보 요약 문자열
     */
    summarize(user: UserModel): string {
        return `User (id = ${user.id}, email = ${user.email}, nickname = ${user.nickname})`;
    }

    /**
     * 중복된 User가 존재하는지 검사
     * @param where - 중복 검사할 User Unique 정보
     * @returns 중복 여부와 중복을 일으킨 이유(reason)
     */
    async existsBy(where: {
        email: string;
        nickname: string;
        mobile: string;
        name: string;
    }): Promise<ReturnType<typeof checkUserPropsExist>> {
        const users = await this.userRepo.findManyUsersByUnique(where);
        const flatten = users.map(user => ({
            email: user.email,
            nickname: user.nickname,
            mobile: user.Profile?.mobile ?? null,
            name: user.Profile?.name ?? null,
        }));
        return checkUserPropsExist(flatten, where);
    }

    /**
     * User의 ID를 기반으로 User, Profile 정보를 함께 조회
     * @param id - User ID
     * @returns 조회한 경우 User와 Profile 정보를 함께 반환, 없으면 FailureName 반환
     * @throws USER_NOT_FOUND - User를 찾을 수 없는 경우
     * @throws PROFILE_NOT_FOUND - Profile을 찾을 수 없는 경우
     */
    async getUserWithProfileById(
        id: string
    ): Promise<
        UserModel | ReturnError<"USER_NOT_FOUND" | "PROFILE_NOT_FOUND">
    > {
        const user = await this.userRepo.findUserAndProfileByUserId(id);
        if (!user) {
            return {
                error: "USER_NOT_FOUND",
                cause: { id },
            };
        }

        const profile = user.Profile;
        if (!profile) {
            return {
                error: "PROFILE_NOT_FOUND",
                cause: { id, user },
            };
        }

        return userMapper({ ...user, Profile: profile });
    }

    /**
     * User의 ID를 기반으로 User를 조회
     * @param id - User ID
     * @returns User 조회 결과, 없으면 Null 반환
     */
    async getUserById(
        id: string
    ): Promise<UserModel | ReturnError<"USER_NOT_FOUND">> {
        const user = await this.userRepo.findUserByUnique({ id });
        if (!user) {
            return {
                error: "USER_NOT_FOUND",
                cause: { id },
            };
        }
        return userMapper(user);
    }

    /**
     * User의 Email을 기반으로 User를 조회
     * @param email - User email
     * @returns User 조회 결과, 없으면 FailureName 반환
     * @throws USER_NOT_FOUND - User를 찾을 수 없는 경우
     */
    async getUserByEmail(
        email: string
    ): Promise<UserModel | ReturnError<"USER_NOT_FOUND">> {
        const user = await this.userRepo.findUserByUnique({ email });
        if (!user) {
            return {
                error: "USER_NOT_FOUND",
                cause: { email },
            };
        }
        return userMapper(user);
    }

    /**
     * User.Profile의 Mobile을 기반으로 User를 조회
     * @param mobile - User profile mobile
     * @returns User 조회 결과, 없으면 Null 반환
     */
    async getUserByMobile(
        mobile: string
    ): Promise<UserModel | ReturnError<"USER_NOT_FOUND">> {
        const profile = await this.profileRepo.findProfileByUnique({
            mobile,
        });
        if (!profile) {
            return {
                error: "USER_NOT_FOUND",
                cause: { mobile },
            };
        }

        const user = await this.userRepo.findUserByUnique({
            id: profile.userId,
        });
        if (!user) {
            return {
                error: "USER_NOT_FOUND",
                cause: { mobile, user },
            };
        }

        return userMapper({ ...user, Profile: profile });
    }

    /**
     * 회원가입으로 User를 생성합니다.
     * @param props - User 생성 정보
     * @returns 생성한 User 객체
     */
    async join(input: UserJoin): Promise<UserModel> {
        const { email, password, nickname, mobile, address, name } = input;

        const user = await this.userRepo.createUser({
            email,
            password: hashUserPassword(password),
            nickname,
            Profile: {
                create: {
                    mobile,
                    name,
                    address,
                },
            },
        });

        return userMapper(user);
    }

    /**
     * User의 Email과 Password를 기반으로 로그인합니다.
     * @param email - 로그인하는 Email
     * @param password - 로그인하는 Password
     * @returns 로그인에 성공한 User 객체, 실패 시 FailureName 반환
     * @throws USER_NOT_FOUND - User를 찾을 수 없는 경우
     * @throws WRONG_PASSWORD - Password가 일치하지 않는 경우
     */
    async login(
        email: string,
        password: string
    ): Promise<UserModel | ReturnError<"USER_NOT_FOUND" | "WRONG_PASSWORD">> {
        const user = await this.userRepo.findUserByUnique({
            email,
        });
        if (!user) {
            return {
                error: "USER_NOT_FOUND",
                cause: { email },
            };
        }

        if (!checkUserPassword(user.password, password)) {
            return {
                error: "WRONG_PASSWORD",
                cause: { email, user },
            };
        }

        return userMapper(user);
    }

    /**
     * User의 Password를 업데이트합니다.
     * @param id - User ID
     * @param newPassword - 변경할 새로운 Password
     */
    async updatePassword(id: string, newPassword: string): Promise<void> {
        await this.userRepo.updateUser(id, {
            password: hashUserPassword(newPassword),
        });
    }

    /**
     * User.Profile의 Mobile을 업데이트합니다.
     * @param userId - User ID
     * @param newMobile - 변경할 새로운 Mobile
     */
    async updateMobile(userId: string, newMobile: string): Promise<void> {
        await this.profileRepo.updateProfileByUserId(userId, {
            mobile: newMobile,
        });
    }

    /**
     * User의 Nickname을 업데이트합니다.
     * @param id - User ID
     * @param newNickname - 변경할 새로운 Nickname
     */
    async updateNickname(id: string, newNickname: string): Promise<void> {
        await this.userRepo.updateUser(id, {
            nickname: newNickname,
        });
    }

    /**
     * User 정보를 삭제합니다.
     * @param id - User ID
     */
    async deactivate(id: string): Promise<void> {
        await this.userRepo.deleteUser(id);
    }

    /**
     * Profile 정보를 조회합니다.
     * @param userId - 조회할 User ID
     */
    async getProfileByUserId(
        userId: string
    ): Promise<UserProfileModel | ReturnError<"PROFILE_NOT_FOUND">> {
        const profile = await this.profileRepo.findProfileByUnique({ userId });
        if (!profile) {
            return {
                error: "PROFILE_NOT_FOUND",
                cause: { userId },
            };
        }
        return userProfileMapper(profile);
    }
}
