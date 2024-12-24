import { Injectable } from "@nestjs/common";
import {
    ApiToService,
    AuthApi,
    AuthToken,
    TokenRefresh,
    UserJoin,
    UserLogin,
} from "src/shared";
import { AuthTokenService } from "./provider/service/auth-token.service";
import { AuthUserService } from "./provider/service/auth-user.service";

@Injectable()
export class AuthService implements ApiToService<AuthApi> {
    constructor(
        private readonly authToken: AuthTokenService,
        private readonly authUser: AuthUserService
    ) {}

    async joinUser(input: UserJoin): Promise<AuthToken> {
        const { email, nickname, mobile, name } = input;
        await this.authUser.assertDuplication(email, nickname, mobile, name);
        const newUser = await this.authUser.joinUser(input);
        const { accessToken, refreshToken } =
            this.authToken.issueAuthTokens(newUser);
        return { accessToken, refreshToken };
    }

    async loginUser(input: UserLogin, ipAddress?: string): Promise<AuthToken> {
        const { email, password } = input;
        const user = await this.authUser.loginUser(email, password, ipAddress);
        const { accessToken, refreshToken } =
            this.authToken.issueAuthTokens(user);
        return { accessToken, refreshToken };
    }

    async refreshUser(input: TokenRefresh): Promise<AuthToken> {
        const user = await this.authUser.getUserById(input.userId);
        await this.authToken.verifyRefreshToken(input.refreshToken, user.id);
        const { accessToken, refreshToken } =
            this.authToken.issueAuthTokens(user);
        return { accessToken, refreshToken };
    }

    async deactivateUser(input: UserLogin): Promise<null> {
        const { email, password } = input;
        const user = await this.authUser.loginUser(email, password);
        await this.authUser.deactivateUser(user.id);
        return null;
    }
}
