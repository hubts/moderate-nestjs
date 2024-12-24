import { Injectable } from "@nestjs/common";
import { ExpectedErrorException } from "src/common/error/expected-error.exception";
import { UserCommandService } from "src/module/user/provider/service/user-command.service";
import { UserQueryService } from "src/module/user/provider/service/user-query.service";
import { UserModel } from "src/shared";

@Injectable()
export class AuthUserService {
    constructor(
        private readonly userCommandService: UserCommandService,
        private readonly userQueryService: UserQueryService
    ) {}

    async assertDuplication(
        email: string,
        nickname: string,
        mobile: string,
        name: string
    ): Promise<void> {
        const duplication = await this.userQueryService.existsBy({
            email,
            nickname,
            mobile,
            name,
        });
        if (duplication.exists) {
            switch (duplication.reason) {
                case "email":
                    throw new ExpectedErrorException("USER_EMAIL_DUPLICATED", {
                        email,
                    });
                case "nickname":
                    throw new ExpectedErrorException(
                        "USER_NICKNAME_DUPLICATED",
                        {
                            nickname,
                        }
                    );
                case "mobile":
                    throw new ExpectedErrorException("USER_MOBILE_DUPLICATED", {
                        mobile,
                    });
            }
        }
    }

    async joinUser(input: {
        email: string;
        password: string;
        nickname: string;
        mobile: string;
        name: string;
        address: string;
        profileImage?: Express.Multer.File;
    }): Promise<UserModel> {
        return await this.userCommandService.join(input);
    }

    async loginUser(
        email: string,
        password: string,
        ipAddress?: string
    ): Promise<UserModel> {
        return await this.userCommandService.login(email, password, {
            ...(ipAddress && { ip: ipAddress }),
        });
    }

    async deactivateUser(userId: string): Promise<void> {
        await this.userCommandService.deactivate(userId);
    }

    async getUserById(userId: string): Promise<UserModel> {
        return await this.userQueryService.getUserById(userId);
    }
}
