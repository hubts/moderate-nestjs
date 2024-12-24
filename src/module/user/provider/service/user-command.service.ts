import { Injectable } from "@nestjs/common";
import { UserModel } from "src/shared";
import { userMapper } from "../../domain/mapper/user.mapper";
import {
    hashUserPassword,
    checkUserPassword,
} from "../../domain/user-password-manager";
import { UserLoginHistoryRepository } from "../repository/user-login-history.repository";
import { UserRepository } from "../repository/user.repository";
import { ExpectedErrorException } from "src/common/error/expected-error.exception";
import { ProfileAttachmentService } from "./profile-attachment.service";

@Injectable()
export class UserCommandService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly userLoginHistoryRepo: UserLoginHistoryRepository,
        private readonly profileAttachmentService: ProfileAttachmentService
    ) {}

    /**
     * Join as a new user.
     * @param input - User information to join.
     * @returns Created user.
     */
    async join(input: {
        email: string;
        password: string;
        nickname: string;
        mobile: string;
        address: string;
        name: string;
        profileImage?: Express.Multer.File;
    }): Promise<UserModel> {
        const {
            email,
            password,
            nickname,
            mobile,
            address,
            name,
            profileImage,
        } = input;
        if (profileImage) {
            await this.profileAttachmentService.uploadProfileImage(
                profileImage
            );
        }
        const createdUser = await this.userRepo.createUser({
            email,
            password: hashUserPassword(password),
            nickname,
            Profile: {
                create: {
                    mobile,
                    name,
                    address,
                    ...(profileImage && { imageUrl: profileImage.path }),
                },
            },
        });
        return userMapper(createdUser);
    }

    /**
     * Login.
     * This creates a login history.
     * @param input - User login information.
     * @returns User information or error.
     */
    async login(
        email: string,
        password: string,
        history?: {
            ip?: string;
            agent?: string;
        }
    ): Promise<UserModel> {
        const user = await this.userRepo.findUserByUnique({ email });
        if (!user) {
            throw new ExpectedErrorException("USER_NOT_FOUND", {
                case: "없는 이메일 입력",
                email,
            });
        }

        const isValidPassword = checkUserPassword(user.password, password);
        if (!isValidPassword) {
            throw new ExpectedErrorException("WRONG_PASSWORD", {
                case: "잘못된 비밀번호 입력",
                email,
            });
        }

        // 로그인 기록
        await this.userLoginHistoryRepo.createUserLoginHistory({
            ip: history?.ip ?? "unknown",
            userAgent: history?.agent ?? "unknown",
            User: { connect: { id: user.id } },
        });

        return userMapper(user);
    }

    /**
     * Update user password.
     * If you want to change the password, you must provide the current password.
     * Furthermore, the new password must be different from the current password.
     * @param id - User ID.
     * @param currentPassword - The current password.
     * @param newPassword - The new password.
     * @returns Nothing, otherwise an error.
     */
    async updatePassword(
        id: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        if (currentPassword === newPassword) {
            throw new ExpectedErrorException("SAME_PASSWORD", {
                case: "같은 비밀번호로 변경",
                userId: id,
            });
        }

        const user = await this.userRepo.findUserByUnique({ id });
        if (!user) {
            throw new ExpectedErrorException("USER_NOT_FOUND", {
                case: "존재하지 않는 ID를 입력한 경우",
                id,
            });
        }

        const isValidPassword = checkUserPassword(
            user.password,
            currentPassword
        );
        if (!isValidPassword) {
            throw new ExpectedErrorException("WRONG_PASSWORD", {
                case: "잘못된 비밀번호 입력",
                userId: id,
            });
        }

        await this.userRepo.updateUser(id, {
            password: hashUserPassword(newPassword),
        });
    }

    /**
     * Update user nickname.
     * @param id - User ID.
     * @param nickname - New nickname.
     * @returns Nothing, otherwise an error.
     */
    async updateNickname(id: string, nickname: string): Promise<void> {
        const user = await this.userRepo.findUserByUnique({ id });
        if (!user) {
            throw new ExpectedErrorException("USER_NOT_FOUND", {
                case: "존재하지 않는 ID를 입력한 경우",
                id,
            });
        }

        const existingUser = await this.userRepo.findUserByUnique({ nickname });
        if (existingUser) {
            throw new ExpectedErrorException("USER_NICKNAME_DUPLICATED", {
                case: "중복된 닉네임 입력",
                nickname,
            });
        }

        await this.userRepo.updateUser(id, { nickname });
    }

    /**
     * Deactivate user.
     * @param id - User ID.
     * @returns Nothing, otherwise an error.
     */
    async deactivate(id: string): Promise<void> {
        const user = await this.userRepo.findUserByUnique({ id });
        if (!user) {
            throw new ExpectedErrorException("USER_NOT_FOUND", {
                case: "존재하지 않는 ID를 입력한 경우",
                id,
            });
        }
        await this.userRepo.deleteUser(id);
    }
}
