import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserRepository } from "./provider/repository/user.repository";
import { ProfileRepository } from "./provider/repository/profile.repository";
import { UserService } from "./user.service";
import { UserQueryService } from "./provider/service/user-query.service";
import { UserCommandService } from "./provider/service/user-command.service";
import { ProfileQueryService } from "./provider/service/profile-query.service";
import { ProfileCommandService } from "./provider/service/profile-command.service";
import { UserLoginHistoryRepository } from "./provider/repository/user-login-history.repository";

const providers = [
    UserRepository,
    ProfileRepository,
    UserLoginHistoryRepository,
    //
    UserQueryService,
    UserCommandService,
    ProfileQueryService,
    ProfileCommandService,
    //
    UserService,
];

@Module({
    controllers: [UserController],
    providers,
    exports: providers,
})
export class UserModule {}
