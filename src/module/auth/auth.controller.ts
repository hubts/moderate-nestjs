import { ApiTags } from "@nestjs/swagger";
import { Body, Controller } from "@nestjs/common";
import { UserJoinDto } from "./dto/user-join.dto";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { AuthTokenDto } from "./dto/auth-token.dto";
import { UserLoginDto } from "./dto/user-login.dto";
import { TokenRefreshDto } from "./dto/token-refresh.dto";
import { AuthRoute } from "src/shared/api/auth/auth.route";
import { AuthApi } from "src/shared/api/auth/auth.api";
import { SUCCESS_MESSAGE } from "src/shared/constant";
import { Route } from "src/common/decorator/api/route.decorator";
import { AuthService } from "./auth.service";
import { asSuccessResponse } from "src/common/response/as-success-response";

@ApiTags(AuthRoute.apiTags)
@Controller(AuthRoute.pathPrefix)
export class AuthController implements AuthApi {
    constructor(private readonly service: AuthService) {}

    @Route.Post(AuthRoute.joinUser, {
        summary: "Anyone can join as a new user.",
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
    async joinUser(
        @Body() body: UserJoinDto
    ): Promise<SuccessResponseDto<AuthTokenDto>> {
        const result = await this.service.joinUser(body);
        return asSuccessResponse(SUCCESS_MESSAGE.AUTH.JOIN_USER, result);
    }

    @Route.Post(AuthRoute.loginUser, {
        summary: "After you joined, you can login as the user.",
        success: {
            message: SUCCESS_MESSAGE.AUTH.LOGIN_USER,
            description: "Returns access and refresh tokens.",
            dataGenericType: AuthTokenDto,
        },
        errors: ["USER_NOT_FOUND", "WRONG_PASSWORD"],
    })
    async loginUser(
        @Body() body: UserLoginDto
    ): Promise<SuccessResponseDto<AuthTokenDto>> {
        const result = await this.service.loginUser(body);
        return asSuccessResponse(SUCCESS_MESSAGE.AUTH.LOGIN_USER, result);
    }

    @Route.Post(AuthRoute.refreshUser, {
        summary: "Refresh your tokens as new ones to continue.",
        success: {
            message: SUCCESS_MESSAGE.AUTH.LOGIN_USER,
            description: "Returns new access and refresh tokens.",
            dataGenericType: AuthTokenDto,
        },
        errors: ["USER_NOT_FOUND", "INVALID_REFRESH_TOKEN"],
    })
    async refreshUser(
        @Body() body: TokenRefreshDto
    ): Promise<SuccessResponseDto<AuthTokenDto>> {
        const result = await this.service.refreshUser(body);
        return asSuccessResponse(SUCCESS_MESSAGE.AUTH.LOGIN_USER, result);
    }

    @Route.Post(AuthRoute.deactivateUser, {
        summary: "Deactivate user for test to soft-delete the user.",
        success: {
            message: SUCCESS_MESSAGE.AUTH.USER_DEACTIVATED,
            description: "User will be deactivated.",
        },
        errors: ["USER_NOT_FOUND", "WRONG_PASSWORD"],
    })
    async deactivateUser(
        @Body() body: UserLoginDto
    ): Promise<SuccessResponseDto> {
        await this.service.deactivateUser(body);
        return asSuccessResponse(SUCCESS_MESSAGE.AUTH.USER_DEACTIVATED);
    }
}
