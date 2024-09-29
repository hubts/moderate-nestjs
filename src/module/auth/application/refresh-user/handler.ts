import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RefreshUserCommand } from "./command";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { AuthTokenDto } from "../../dto/auth-token.dto";
import { AuthService } from "../../service/auth.service";
import { ExpectedErrorException } from "src/common/error/exception/expected-error.exception";
import { SUCCESS_MESSAGE } from "src/shared/constant";
import { asSuccessResponse } from "src/common/response/as-success-response";
import { UserService } from "src/module/user/service/user.service";
import { isError } from "src/common/error/util/error";

@CommandHandler(RefreshUserCommand)
export class RefreshUserHandler
    implements
        ICommandHandler<RefreshUserCommand, SuccessResponseDto<AuthTokenDto>>
{
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    async execute(
        command: RefreshUserCommand
    ): Promise<SuccessResponseDto<AuthTokenDto>> {
        const { refreshToken, userId } = command.dto;

        /**
         * Condition
         */

        // 1. Does the user exist?
        const user = await this.userService.getUserById(userId);
        if (isError(user)) {
            throw new ExpectedErrorException("USER_NOT_FOUND");
        }

        // 2. Is the refresh token valid?
        const isValid = await this.authService.verifyRefreshToken(
            refreshToken,
            userId
        );
        if (!isValid) {
            throw new ExpectedErrorException("INVALID_REFRESH_TOKEN");
        }

        /**
         * Execution
         */

        // 1. Generate a new tokens.
        const { accessToken, refreshToken: newRefreshToken } =
            this.authService.issueAuthTokens(user);

        /**
         * Returns
         */

        return asSuccessResponse(SUCCESS_MESSAGE.AUTH.LOGIN_USER, {
            accessToken,
            refreshToken: newRefreshToken,
        });
    }
}
