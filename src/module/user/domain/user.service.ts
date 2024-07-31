import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repository/user.repository";
import { checkUserPropsExist } from "./check-user-props-exist";
import { checkUserPassword, hashUserPassword } from "./user-password-manager";
import { ReturnFailure } from "src/shared/response/interface/response.type";
import { isFailureName } from "src/shared/response/util/is-failure-name";
import { Profile, User } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepository) {}

    /**
     * User 정보를 요약하여 출력합니다.
     * @param user - User 객체
     * @returns User 정보 요약 문자열
     */
    summarize(user: User): string {
        return `User (id = ${user.id}, email = ${user.email}, nickname = ${user.nickname})`;
    }

    /**
     * 중복된 User가 존재하는지 검사합니다.
     * @param where - 중복 검사할 User Unique 정보
     * @returns 중복 여부와 중복을 일으킨 이유(reason)
     */
    async existsBy(where: {
        email: string;
        nickname: string;
        mobile: string;
    }): Promise<ReturnType<typeof checkUserPropsExist>> {
        const users =
            await this.userRepo.findManyUsersByEmailOrNicknameOrMobile(where);
        const flatten = users.map(user => ({
            email: user.email,
            nickname: user.nickname,
            mobile: user.Profile?.mobile,
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
        | ReturnFailure<"USER_NOT_FOUND" | "PROFILE_NOT_FOUND">
        | (User & { Profile: Profile })
    > {
        const userWithProfile = await this.userRepo.findUserWithProfileById(id);
        if (!userWithProfile) {
            return "USER_NOT_FOUND";
        } else if (!userWithProfile.Profile) {
            return "PROFILE_NOT_FOUND";
        }

        return userWithProfile as User & { Profile: Profile };
    }

    /**
     * User의 ID를 기반으로 User를 조회
     * @param id - User ID
     * @returns User 조회 결과, 없으면 Null 반환
     */
    async getUserById(id: string): Promise<User | null> {
        return await this.userRepo.findUser({ id });
    }

    /**
     * User의 Email을 기반으로 User를 조회
     * @param email - User email
     * @returns User 조회 결과, 없으면 FailureName 반환
     * @throws USER_NOT_FOUND - User를 찾을 수 없는 경우
     */
    async getUserByEmail(
        email: string
    ): Promise<User | ReturnFailure<"USER_NOT_FOUND">> {
        const user = await this.userRepo.findUser({ email });
        if (!user) {
            return "USER_NOT_FOUND";
        }
        return user;
    }

    /**
     * User.Profile의 Mobile을 기반으로 User를 조회
     * @param mobile - User profile mobile
     * @returns User 조회 결과, 없으면 Null 반환
     */
    async getUserByMobile(mobile: string): Promise<User | null> {
        return await this.userRepo.findUserByMobile(mobile);
    }

    /**
     * 회원가입으로 User를 생성합니다.
     * @param props - User 생성 정보
     * @returns 생성한 User 객체
     */
    async join(props: {
        email: string;
        password: string;
        nickname: string;
        mobile: string;
    }): Promise<User> {
        const { email, password, nickname, mobile } = props;
        return await this.userRepo.createUser({
            email,
            password: hashUserPassword(password),
            nickname,
            Profile: {
                create: {
                    mobile,
                },
            },
        });
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
    ): Promise<User | ReturnFailure<"USER_NOT_FOUND" | "WRONG_PASSWORD">> {
        const userByEmailResult = await this.getUserByEmail(email);
        if (isFailureName(userByEmailResult)) {
            return userByEmailResult;
        }

        const user = userByEmailResult;
        if (!checkUserPassword(user.password, password)) {
            return "WRONG_PASSWORD";
        }

        return user;
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
        await this.userRepo.updateProfileByUserId(userId, {
            mobile: newMobile,
        });
    }

    /**
     * User 정보를 삭제합니다.
     * @param id - User ID
     */
    async deactivate(id: string): Promise<void> {
        return await this.userRepo.deleteUser(id);
    }
}
