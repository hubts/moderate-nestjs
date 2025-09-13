import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./service/jwt.strategy";
import { JwtConfigService } from "src/config/internal/jwt.config.service";
import { UserModule } from "../user/user.module";
import { AuthTokenService } from "./service/auth-token.service";
import { AuthUserService } from "./service/auth-user.service";
import { AuthFacade } from "./auth.facade";

const providers = [AuthFacade, AuthTokenService, AuthUserService, JwtStrategy];

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
