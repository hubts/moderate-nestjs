import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";

import { JwtConfig } from "src/config/internal/jwt.config";
import { ExpectedErrorException } from "src/common/error/expected-error.exception";
import { User, UserJwtPayload } from "@sdk";
import { UserService } from "@/module/user/service/user.service";

/**
 * Define a validation strategy for 'JwtAuthGuard'.
 *
 * After the validation of JwtAuthGuard,
 *
 * As defined at constructor, JWT is extracted from 'Request'.
 * The token is confirmed by secret(public key), and transformed as payload.
 * Then, the valid user would be found, and returned.
 *
 * @param {UserJwtPayload} payload - The payload relayed from Hasura server (extracted by).
 * @return {User} The valid user (return is saved at 'user' field of 'Request' as 'request.user').
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(JwtConfig.KEY)
        jwtConfig: ConfigType<typeof JwtConfig>,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfig.publicKey,
        });
    }

    async validate(payload: UserJwtPayload): Promise<User> {
        const { id, role } = payload;
        // Check if the payload is valid
        if (!id || !role) {
            throw new ExpectedErrorException(
                "UNAUTHORIZED",
                undefined,
                "Invalid JWT payload"
            );
        }

        // Check if the user exists
        const user = await this.userService.getUserById(id);
        return user;
    }
}
