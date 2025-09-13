import { Injectable } from "@nestjs/common";
import { ProfileRepository } from "../repository/profile.repository";
import { UserRepository } from "../repository/user.repository";
import { ExpectedErrorException } from "@/common/error/expected-error.exception";
import { Profile, User } from "@sdk";
import { createUser } from "../domain/create-user";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly profileRepository: ProfileRepository
    ) {}

    /**
     * 유저 생성
     * - 이메일 중복 체크
     */
    async createUser(input: {
        email: string;
        password: string;
    }): Promise<User> {
        const { email, password } = input;
        await this.assertEmailDuplicated(email);
        const user = createUser({ email, password });
        const createdUser = await this.userRepository.create({
            email: user.email,
            password: user.password,
            nickname: user.nickname,
            role: user.role,
        });
        return createdUser;
    }

    /**
     * 유저 생성을 위한 체크
     * - 이메일 중복 체크
     * - 존재하면 에러
     */
    async assertEmailDuplicated(email: string): Promise<void> {
        const user = await this.userRepository.findOne({ email });
        if (user) {
            throw new ExpectedErrorException("USER_EMAIL_DUPLICATED", {
                email,
            });
        }
    }

    /**
     * ID 기반 유저 조회
     * - 존재하지 않으면 에러
     */
    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ id });
        if (!user) {
            throw new ExpectedErrorException("USER_NOT_FOUND", {
                id,
            });
        }
        return user;
    }

    /**
     * 이메일 기반 유저 조회
     * - 존재하지 않으면 에러
     */
    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new ExpectedErrorException("USER_NOT_FOUND", {
                email,
            });
        }
        return user;
    }

    /**
     * ID 기반 유저 & 프로필 조회
     * - 존재하지 않으면 에러
     */
    async getUserAndProfileById(id: string): Promise<
        User & {
            profile: Profile;
        }
    > {
        const user = await this.getUserById(id);
        const profile = await this.profileRepository.findOne({ userId: id });
        if (!profile) {
            throw new ExpectedErrorException("PROFILE_NOT_FOUND", {
                userId: id,
            });
        }
        return { ...user, profile };
    }

    /**
     * 이메일 기반 유저 & 프로필 조회
     * - 존재하지 않으면 에러
     */
    async getUserAndProfileByEmail(email: string): Promise<
        User & {
            profile: Profile;
        }
    > {
        const user = await this.getUserByEmail(email);
        const profile = await this.profileRepository.findOne({
            userId: user.id,
        });
        if (!profile) {
            throw new ExpectedErrorException("PROFILE_NOT_FOUND", {
                userId: user.id,
            });
        }
        return { ...user, profile };
    }

    /**
     * 닉네임 업데이트
     */
    async updateNickname(userId: string, nickname: string): Promise<void> {
        // 중복 검사
        const existingNickname = await this.userRepository.findOne({
            nickname,
        });
        if (existingNickname) {
            throw new ExpectedErrorException("USER_NICKNAME_DUPLICATED", {
                nickname,
            });
        }

        // 업데이트
        await this.userRepository.update(userId, {
            nickname,
        });
    }

    /**
     * 유저 로그인 기록 저장
     */
    async login(
        userId: string,
        input: {
            ipAddress: string;
            userAgent: string;
        }
    ): Promise<void> {
        await this.userRepository.createLoginHistory({
            User: { connect: { id: userId } },
            ip: input.ipAddress,
            userAgent: input.userAgent,
        });
    }

    /**
     * 유저 탈퇴
     */
    async deactivate(userId: string): Promise<void> {
        await this.userRepository.update(userId, {
            deletedAt: new Date(),
        });
        await this.profileRepository.updateByUserId(userId, {
            deletedAt: new Date(),
        });
    }
}
