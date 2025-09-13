import { Injectable } from "@nestjs/common";
import { User } from "@sdk";
import { checkUserPassword } from "../domain/password-manager";
import { ExpectedErrorException } from "@/common/error/expected-error.exception";
import { UserService } from "@/module/user/service/user.service";

@Injectable()
export class AuthUserService {
    constructor(private readonly userService: UserService) {}

    async loginUser(
        user: User,
        inputPassword: string,
        request?: {
            ipAddress?: string;
            userAgent?: string;
        }
    ): Promise<void> {
        // 유저 비밀번호 검사
        const isPasswordValid = checkUserPassword(user.password, inputPassword);
        if (!isPasswordValid) {
            throw new ExpectedErrorException("WRONG_PASSWORD", {
                userId: user.id,
            });
        }

        // 로그인 기록 저장
        await this.userService.login(user.id, {
            ipAddress: request?.ipAddress || "unknown",
            userAgent: request?.userAgent || "unknown",
        });
    }

    async deactivateUser(userId: string): Promise<void> {
        await this.userService.deactivate(userId);
    }
}
