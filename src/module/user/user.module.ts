import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserRepository } from "./repository/user.repository";
import { GetUserInfoByIdHandler } from "./application/get-user-info-by-id/handler";
import { GetUserInfoByEmailHandler } from "./application/get-user-info-by-email/handler";
import { GetMyInfoHandler } from "./application/get-my-info/handler";
import { ProfileRepository } from "./repository/profile.repository";
import { UserService } from "./service/user.service";
import { UpdateMyInfoHandler } from "./application/update-my-info/handler";

const providers = [
    UserService,
    UserRepository,
    ProfileRepository,
    GetUserInfoByIdHandler,
    GetUserInfoByEmailHandler,
    GetMyInfoHandler,
    UpdateMyInfoHandler,
];

@Module({
    controllers: [UserController],
    providers,
    exports: providers,
})
export class UserModule {}
