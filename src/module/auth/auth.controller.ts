import { ApiTags } from "@nestjs/swagger";
import { Body, Controller } from "@nestjs/common";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import {
    AuthInterface,
    AuthRoute,
    TokenRefresh,
    User,
    UserJoin,
    UserLogin,
    UserAuthToken,
} from "@sdk";
import { SUCCESS_MESSAGE } from "@sdk";
import { Route } from "src/common/decorator/api/route.decorator";
import { asSuccessResponse } from "src/common/response/as-success-response";
import { Ipv4 } from "src/common/decorator/api/ipv4.decorator";
import { Requestor } from "@/common/decorator/auth/requestor.decorator";
import { AuthFacade } from "./auth.facade";
import { UserAgent } from "@/common/decorator/api/user-agent.decorator";
import typia from "typia";
import { ExpectedErrorException } from "@/common/error/expected-error.exception";

@ApiTags(AuthRoute.apiTags)
@Controller(AuthRoute.context)
export class AuthController implements AuthInterface {
    constructor(private readonly facade: AuthFacade) {}

    @Route.Post(AuthRoute.joinUser, {
        summary: "이메일 기반으로 회원가입합니다.",
        success: {
            message: SUCCESS_MESSAGE.AUTH.JOIN_USER,
            description: "새로운 유저를 생성하고, 토큰을 발급합니다.",
            example: typia.random<UserAuthToken>(),
        },
        errors: [
            "USER_EMAIL_DUPLICATED",
            "USER_NICKNAME_DUPLICATED",
            "USER_MOBILE_DUPLICATED",
        ],
        request: {
            body: typia.random<UserJoin>(),
        },
    })
    async joinUser(
        @Body() body: UserJoin
    ): Promise<SuccessResponseDto<UserAuthToken>> {
        typia.assert<UserJoin>(body);
        const result = await this.facade.joinUser(body);
        return asSuccessResponse(SUCCESS_MESSAGE.AUTH.JOIN_USER, result);
    }

    @Route.Post(AuthRoute.loginUser, {
        summary: "이메일 기반으로 로그인합니다.",
        success: {
            message: SUCCESS_MESSAGE.AUTH.LOGIN_USER,
            description: "로그인에 성공하면, 토큰을 발급합니다.",
            example: typia.random<UserAuthToken>(),
        },
        errors: ["USER_NOT_FOUND", "WRONG_PASSWORD"],
        request: {
            body: typia.random<UserLogin>(),
        },
    })
    async loginUser(
        @Body() body: UserLogin,
        @Ipv4() ipAddress?: string,
        @UserAgent() userAgent?: string
    ): Promise<SuccessResponseDto<UserAuthToken>> {
        typia.assert<UserLogin>(body);
        const result = await this.facade.loginUser(body, {
            ...(ipAddress && { ipAddress }),
            ...(userAgent && { userAgent }),
        });
        return asSuccessResponse(SUCCESS_MESSAGE.AUTH.LOGIN_USER, result);
    }

    @Route.Post(AuthRoute.refreshUser, {
        summary: "토큰을 갱신합니다.",
        success: {
            message: SUCCESS_MESSAGE.AUTH.LOGIN_USER,
            description: "새로운 토큰으로 갱신하여 발급합니다.",
            example: typia.random<UserAuthToken>(),
        },
        errors: ["USER_NOT_FOUND", "INVALID_REFRESH_TOKEN"],
        request: {
            body: typia.random<TokenRefresh>(),
        },
    })
    async refreshUser(
        @Body() body: TokenRefresh
    ): Promise<SuccessResponseDto<UserAuthToken>> {
        typia.assert<TokenRefresh>(body);
        const result = await this.facade.refreshUser(body);
        return asSuccessResponse(SUCCESS_MESSAGE.AUTH.LOGIN_USER, result);
    }

    @Route.Post(AuthRoute.deactivateUser, {
        summary: "회원탈퇴합니다.",
        success: {
            message: SUCCESS_MESSAGE.AUTH.USER_DEACTIVATED,
            description: "더 이상 유저를 사용할 수 없게 됩니다.",
        },
        errors: ["USER_NOT_FOUND", "WRONG_PASSWORD"],
    })
    async deactivateUser(@Requestor() user: User): Promise<SuccessResponseDto> {
        await this.facade.deactivateUser(user);
        return asSuccessResponse(SUCCESS_MESSAGE.AUTH.USER_DEACTIVATED);
    }
}
