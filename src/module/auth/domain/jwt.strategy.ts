import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";

import { JwtConfig } from "src/config/validated/jwt.config";
import { JwtPayload } from "src/shared/role/jwt-payload.interface";
import { UserModel } from "src/shared/api/user/user.domain";
import { UserService } from "src/module/user/service/user.service";
import { isError } from "src/common/error/util/error";

/**
 * Define a validation strategy for 'JwtAuthGuard'.
 *
 * After the validation of JwtAuthGuard,
 *
 * As defined at constructor, JWT is extracted from 'Request'.
 * The token is confirmed by secret(public key), and transformed as payload.
 * Then, the valid user would be found, and returned.
 *
 * @param {JwtPayload} payload - The payload relayed from Hasura server (extracted by).
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

    async validate(payload: JwtPayload): Promise<UserModel> {
        const { id, role } = payload;
        if (!id || !role) {
            throw new UnauthorizedException("Invalid JWT payload");
        }

        const user = await this.userService.getUserById(id);
        if (isError(user)) {
            throw new UnauthorizedException("Unknown user ID");
        }
        return user;
    }
}
