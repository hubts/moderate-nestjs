import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JoinUserCommand } from "./application/join-user/command";
import { LoginUserCommand } from "./application/login-user/command";
import { UserJoinDto } from "./dto/user-join.dto";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { AuthTokenDto } from "./dto/auth-token.dto";
import { JwtRolesAuth } from "src/common/decorator/auth/jwt-roles-auth.decorator";
import { UserLoginDto } from "./dto/user-login.dto";
import { TokenRefreshDto } from "./dto/token-refresh.dto";
import { RefreshUserCommand } from "./application/refresh-user/command";
import { DeactivateUserCommand } from "./application/deactivate-user/command";
import { ApiSpec } from "src/common/decorator/api/api-spec.decorator";
import { AuthRoute } from "src/shared/api/auth/auth.route";
import { AuthApi } from "src/shared/api/auth/auth.api";
import { SUCCESS_MESSAGE } from "src/shared/constant";

@ApiTags(AuthRoute.apiTags)
@Controller(AuthRoute.pathPrefix)
export class AuthController implements AuthApi {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiSpec({
        summary: "Anyone can join as a new user.",
        description: AuthRoute.joinUser.description,
        success: {
            message: SUCCESS_MESSAGE.AUTH.JOIN_USER,
            description:
                "Creates a new user and returns access and refresh tokens.",
            dataGenericType: AuthTokenDto,
        },
        errors: [
            "USER_EMAIL_DUPLICATED",
            "USER_NICKNAME_DUPLICATED",
            "USER_MOBILE_DUPLICATED",
        ],
    })
    @JwtRolesAuth(AuthRoute.joinUser.roles)
    @Post(AuthRoute.joinUser.subRoute)
    async joinUser(
        @Body() body: UserJoinDto
    ): Promise<SuccessResponseDto<AuthTokenDto>> {
        return await this.commandBus.execute(new JoinUserCommand(body));
    }

    @ApiSpec({
        summary: "After you joined, you can login as the user.",
        description: AuthRoute.loginUser.description,
        success: {
            message: SUCCESS_MESSAGE.AUTH.LOGIN_USER,
            description: "Returns access and refresh tokens.",
            dataGenericType: AuthTokenDto,
        },
        errors: ["USER_NOT_FOUND", "WRONG_PASSWORD"],
    })
    @JwtRolesAuth(AuthRoute.loginUser.roles)
    @Post(AuthRoute.loginUser.subRoute)
    async loginUser(
        @Body() body: UserLoginDto
    ): Promise<SuccessResponseDto<AuthTokenDto>> {
        return await this.commandBus.execute(new LoginUserCommand(body));
    }

    @ApiSpec({
        summary: "Refresh your tokens as new ones to continue.",
        description: AuthRoute.refreshUser.description,
        success: {
            message: SUCCESS_MESSAGE.AUTH.LOGIN_USER,
            description: "Returns new access and refresh tokens.",
            dataGenericType: AuthTokenDto,
        },
        errors: ["USER_NOT_FOUND", "INVALID_REFRESH_TOKEN"],
    })
    @JwtRolesAuth(AuthRoute.refreshUser.roles)
    @Post(AuthRoute.refreshUser.subRoute)
    async refreshUser(
        @Body() body: TokenRefreshDto
    ): Promise<SuccessResponseDto<AuthTokenDto>> {
        return await this.commandBus.execute(new RefreshUserCommand(body));
    }

    @ApiSpec({
        summary: "Deactivate user for test to soft-delete the user.",
        description: AuthRoute.deactivateUser.description,
        success: {
            message: SUCCESS_MESSAGE.AUTH.USER_DEACTIVATED,
            description: "User will be deactivated.",
        },
        errors: ["USER_NOT_FOUND", "WRONG_PASSWORD"],
    })
    @JwtRolesAuth(AuthRoute.deactivateUser.roles)
    @Post(AuthRoute.deactivateUser.subRoute)
    async deactivateUser(
        @Body() body: UserLoginDto
    ): Promise<SuccessResponseDto> {
        return await this.commandBus.execute(new DeactivateUserCommand(body));
    }
}
