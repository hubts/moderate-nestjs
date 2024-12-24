import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./provider/infra/jwt.strategy";
import { JwtConfigService } from "src/config/internal/jwt.config.service";
import { UserModule } from "../user/user.module";
import { AuthTokenService } from "./provider/service/auth-token.service";
import { AuthUserService } from "./provider/service/auth-user.service";
import { AuthService } from "./auth.service";

const providers = [
    AuthTokenService,
    AuthUserService,
    AuthService,
    //
    JwtStrategy,
];

@Module({
    imports: [
        JwtModule.registerAsync({
            useClass: JwtConfigService,
        }),
        UserModule,
    ],
    controllers: [AuthController],
    providers,
})
export class AuthModule {}
