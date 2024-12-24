import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JwtConfig } from "src/config/internal/jwt.config";
import { CacheService } from "src/infrastructure/_cache/cache.service";
import {
    REFRESH_TOKEN_KEY_PREFIX,
    REFRESH_TOKEN_LENGTH,
} from "../../constant/token.constant";
import { JwtPayload, UserRole } from "src/shared";
import { CryptoExtension } from "src/common/util/crypto-extension";
import { Random } from "src/common/util/random";
import { ExpectedErrorException } from "src/common/error/exception/expected-error.exception";

@Injectable()
export class AuthTokenService {
    constructor(
        @Inject(JwtConfig.KEY)
        private readonly jwtConfig: ConfigType<typeof JwtConfig>,
        private readonly jwtService: JwtService,
        private readonly cacheService: CacheService
    ) {}

    /**
     * (Private)
     * Get a refresh token key.
     * The key may not be unique according to random refresh token within the user.
     * @param refreshToken - A refresh token.
     * @param id - A unique identifier.
     * @returns The hash of refresh token key.
     */
    private getRefreshTokenKey(refreshToken: string, id: string): string {
        return `${REFRESH_TOKEN_KEY_PREFIX}:${refreshToken}:${id}`;
    }

    /**
     * Issue a new access token and refresh token.
     * @param props - Properties of target(actor) model authenticated.
     * @returns A new access token and refresh token for target.
     */
    issueAuthTokens(props: { id: string; role: UserRole; nickname: string }): {
        accessToken: string;
        refreshToken: string;
    } {
        const { id, role, nickname } = props;

        // Access token
        const payload: JwtPayload = {
            id,
            role,
            nickname,
        };
        const accessToken = this.jwtService.sign(payload);

        // Refresh token
        const refreshToken = Random.hex(REFRESH_TOKEN_LENGTH);
        const refreshTokenKey = this.getRefreshTokenKey(refreshToken, id);
        this.cacheService.set(
            refreshToken,
            CryptoExtension.hashPassword(refreshTokenKey),
            this.jwtConfig.refreshTokenExpiresIn
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    /**
     * Verify a refresh token.
     * @param refreshToken - A refresh token issued.
     * @param id - A unique identifier.
     * @returns True if the refresh token is valid, otherwise false.
     */
    async verifyRefreshToken(refreshToken: string, id: string): Promise<void> {
        const value = await this.cacheService.get(refreshToken);
        if (!value) {
            throw new ExpectedErrorException("INVALID_REFRESH_TOKEN", {
                case: "저장된 Refresh Token이 없음",
                id,
            });
        }
        const refreshTokenKey = this.getRefreshTokenKey(refreshToken, id);
        const isValid = CryptoExtension.comparePassword(refreshTokenKey, value);
        if (!isValid) {
            throw new ExpectedErrorException("INVALID_REFRESH_TOKEN", {
                case: "Refresh Token이 일치하지 않음",
                id,
            });
        }
    }
}
