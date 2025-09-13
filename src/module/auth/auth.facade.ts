import { Injectable } from "@nestjs/common";
import { TokenRefresh, User, UserAuthToken, UserJoin, UserLogin } from "@sdk";
import { AuthTokenService } from "./service/auth-token.service";
import { AuthUserService } from "./service/auth-user.service";
import { UserService } from "../user/service/user.service";

@Injectable()
export class AuthFacade {
    constructor(
        private readonly userService: UserService,
        private readonly authTokenService: AuthTokenService,
        private readonly authUserService: AuthUserService
    ) {}

    /**
     * 이메일 기반 회원가입
     * - 유저 생성
     * - 토큰 발급
     */
    async joinUser(input: UserJoin): Promise<UserAuthToken> {
        // 유저 생성
        const newUser = await this.userService.createUser(input);

        // 토큰 발급
        const { accessToken, refreshToken } =
            this.authTokenService.issueAuthTokens(newUser);

        return { accessToken, refreshToken };
    }

    /**
     * 이메일 기반 로그인
     */
    async loginUser(
        input: UserLogin,
        request?: {
            ipAddress?: string;
            userAgent?: string;
        }
    ): Promise<UserAuthToken> {
        // 유저 조회
        const user = await this.userService.getUserByEmail(input.email);

        // 유저 로그인
        await this.authUserService.loginUser(user, input.password, request);

        // 토큰 발급
        const { accessToken, refreshToken } =
            this.authTokenService.issueAuthTokens(user);

        return { accessToken, refreshToken };
    }

    /**
     * 토큰 갱신
     */
    async refreshUser(input: TokenRefresh): Promise<UserAuthToken> {
        // 갱신 토큰 검증
        await this.authTokenService.verifyRefreshToken(
            input.refreshToken,
            input.userId
        );

        // 유저 조회
        const user = await this.userService.getUserById(input.userId);

        // 토큰 발급
        const { accessToken, refreshToken } =
            this.authTokenService.issueAuthTokens(user);

        return { accessToken, refreshToken };
    }

    /**
     * 회원 탈퇴
     */
    async deactivateUser(user: User): Promise<void> {
        await this.authUserService.deactivateUser(user.id);
    }
}
