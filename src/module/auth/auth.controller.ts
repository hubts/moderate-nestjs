import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JoinUserCommand } from "./application/join-user/command";
import { LoginUserCommand } from "./application/login-user/command";
import { UserJoinDto } from "./dto/user-join.dto";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { AuthTokenDto } from "./dto/auth-token.dto";
import { JwtRolesAuth } from "src/common/decorator/auth/jwt-roles-auth.decorator";
import { SUCCESS_MESSAGE } from "src/shared/response/message/success-message";
import { UserLoginDto } from "./dto/user-login.dto";
import { AuthRoute, IAuthApi } from "src/shared/api/auth.api";
import { UserRefreshDto } from "./dto/user-refresh.dto";
import { RefreshUserCommand } from "./application/refresh-user/command";
import { DeactivateUserCommand } from "./application/deactivate-user/command";
import { ApiSpec } from "src/common/decorator/api/api-spec.decorator";

@ApiTags(AuthRoute.prefix)
@Controller(AuthRoute.prefix)
export class AuthController implements IAuthApi {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiSpec({
        summary: "Anyone can join as a new user.",
        description: AuthRoute.subPath.joinUser.description,
        success: {
            message: SUCCESS_MESSAGE.AUTH.JOIN_USER,
            description:
                "Creates a new user and returns access and refresh tokens.",
            dataGenericType: AuthTokenDto,
        },
        failures: [
            {
                status: HttpStatus.BAD_REQUEST,
                examples: [
                    {
                        name: "DUPLICATE_EMAIL",
                        description: "When the email already exists.",
                    },
                    {
                        name: "DUPLICATE_NICKNAME",
                        description: "When the nickname already exists.",
                    },
                    {
                        name: "DUPLICATE_MOBILE",
                        description: "When the mobile already exists.",
                    },
                ],
            },
        ],
    })
    @JwtRolesAuth(AuthRoute.subPath.joinUser.roles)
    @Post(AuthRoute.subPath.joinUser.name)
    async joinUser(
        @Body() body: UserJoinDto
    ): Promise<SuccessResponseDto<AuthTokenDto>> {
        return await this.commandBus.execute(new JoinUserCommand(body));
    }

    @ApiSpec({
        summary: "After you joined, you can login as the user.",
        description: AuthRoute.subPath.loginUser.description,
        success: {
            message: SUCCESS_MESSAGE.AUTH.LOGIN_USER,
            description: "Returns access and refresh tokens.",
            dataGenericType: AuthTokenDto,
        },
        failures: [
            {
                status: HttpStatus.BAD_REQUEST,
                examples: [
                    {
                        name: "UNREGISTERED_EMAIL",
                        description: "When the email does not exist.",
                    },
                    {
                        name: "WRONG_PASSWORD",
                        description:
                            "When the password is incorrect corresponding to the email.",
                    },
                ],
            },
        ],
    })
    @JwtRolesAuth(AuthRoute.subPath.loginUser.roles)
    @Post(AuthRoute.subPath.loginUser.name)
    async loginUser(
        @Body() body: UserLoginDto
    ): Promise<SuccessResponseDto<AuthTokenDto>> {
        return await this.commandBus.execute(new LoginUserCommand(body));
    }

    @ApiSpec({
        summary: "Refresh your tokens as new ones to continue.",
        description: AuthRoute.subPath.refreshUser.description,
        success: {
            message: SUCCESS_MESSAGE.AUTH.LOGIN_USER,
            description: "Returns new access and refresh tokens.",
            dataGenericType: AuthTokenDto,
        },
        failures: [
            {
                status: HttpStatus.NOT_FOUND,
                examples: [
                    {
                        name: "USER_NOT_FOUND",
                        description: "When the user not found.",
                    },
                ],
            },
            {
                status: HttpStatus.BAD_REQUEST,
                examples: [
                    {
                        name: "INVALID_REFRESH_TOKEN",
                        description: "When the refresh token is invalid.",
                    },
                ],
            },
        ],
    })
    @JwtRolesAuth(AuthRoute.subPath.refreshUser.roles)
    @Post(AuthRoute.subPath.refreshUser.name)
    async refreshUser(
        @Body() body: UserRefreshDto
    ): Promise<SuccessResponseDto<AuthTokenDto>> {
        return await this.commandBus.execute(new RefreshUserCommand(body));
    }

    @ApiSpec({
        summary: "Deactivate user for test to soft-delete the user.",
        description: AuthRoute.subPath.deactivateUser.description,
        success: {
            message: SUCCESS_MESSAGE.AUTH.USER_DEACTIVATED,
            description: "User will be deactivated.",
        },
        failures: [
            {
                status: HttpStatus.NOT_FOUND,
                examples: [
                    {
                        name: "UNREGISTERED_EMAIL",
                        description: "Unknown email.",
                    },
                ],
            },
            {
                status: HttpStatus.BAD_REQUEST,
                examples: [
                    {
                        name: "WRONG_PASSWORD",
                        description: "Email and password does not match",
                    },
                ],
            },
        ],
    })
    @JwtRolesAuth(AuthRoute.subPath.deactivateUser.roles)
    @Post(AuthRoute.subPath.deactivateUser.name)
    async deactivateUser(
        @Body() body: UserLoginDto
    ): Promise<SuccessResponseDto> {
        return await this.commandBus.execute(new DeactivateUserCommand(body));
    }
}
