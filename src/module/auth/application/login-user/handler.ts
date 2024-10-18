import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";

import { LoginUserCommand } from "./command";

import { AuthService } from "../../service/auth.service";
import { AuthTokenDto } from "../../dto/auth-token.dto";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { ExpectedErrorException } from "src/common/error/exception/expected-error.exception";
import { SUCCESS_MESSAGE } from "src/shared/constant";
import { asSuccessResponse } from "src/common/response/as-success-response";
import { isError } from "src/common/error/util/error";
import { UserService } from "src/module/user/service/user.service";
import { UserModel } from "src/shared/api/user/user.domain";

@CommandHandler(LoginUserCommand)
export class LoginUserHandler
    implements
        ICommandHandler<LoginUserCommand, SuccessResponseDto<AuthTokenDto>>
{
    private logger = new Logger(LoginUserHandler.name);

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    async execute(
        command: LoginUserCommand
    ): Promise<SuccessResponseDto<AuthTokenDto>> {
        const { email, password } = command.dto;

        /** 조건부 */

        // 조건 1: User 로그인 시도
        const user = await this.userService.login(email, password);
        if (isError(user)) {
            switch (user.error) {
                case "USER_NOT_FOUND": {
                    throw new ExpectedErrorException("USER_NOT_FOUND", {
                        email,
                    });
                }
                case "WRONG_PASSWORD": {
                    throw new ExpectedErrorException("WRONG_PASSWORD", {
                        email,
                    });
                }
            }
        }

        /** 실행부 */

        // 실행 1: 로그인 토큰 발행
        const { accessToken, refreshToken } =
            this.authService.issueAuthTokens(user);

        // 종료
        this.log(user);
        return asSuccessResponse(SUCCESS_MESSAGE.AUTH.JOIN_USER, {
            accessToken,
            refreshToken,
        });
    }

    log(user: UserModel) {
        this.logger.log(`User login: ${this.userService.summarize(user)}`);
    }
}
