import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JwtConfig } from "src/config/internal/jwt.config";
import { CacheService } from "src/infrastructure/_cache/cache.service";
import { CryptoExtension } from "src/common/util/crypto-extension";
import { ExpectedErrorException } from "src/common/error/expected-error.exception";
import { Enum, User, UserJwtPayload } from "@sdk";
import { faker } from "@faker-js/faker";

@Injectable()
export class AuthTokenService {
    private readonly REFRESH_TOKEN_KEY_PREFIX = "refresh";
    private readonly REFRESH_TOKEN_LENGTH = 32;

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
        return `${this.REFRESH_TOKEN_KEY_PREFIX}:${refreshToken}:${id}`;
    }

    /**
     * Generate a refresh token.
     * @returns A new random refresh token.
     */
    private generateRefreshToken(): string {
        return faker.string.hexadecimal({ length: this.REFRESH_TOKEN_LENGTH });
    }

    /**
     * Issue a new access token and refresh token.
     * @param props - Properties of target(actor) model authenticated.
     * @returns A new access token and refresh token for target.
     */
    issueAuthTokens(user: User): {
        accessToken: string;
        refreshToken: string;
    } {
        // Access token
        const payload: UserJwtPayload = {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            role: user.role as Enum.UserRole,
        };
        const accessToken = this.jwtService.sign(payload);

        // Refresh token
        const refreshToken = this.generateRefreshToken();
        const refreshTokenKey = this.getRefreshTokenKey(refreshToken, user.id);
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
