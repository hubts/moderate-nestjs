import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserRepository } from "./repository/user.repository";
import { ProfileRepository } from "./repository/profile.repository";
import { UserService } from "./service/user.service";
import { ProfileService } from "./service/profile.service";
import { UserFacade } from "./user.facade";

const providers = [
    UserFacade,
    UserRepository,
    ProfileRepository,
    UserService,
    ProfileService,
];

@Module({
    controllers: [UserController],
    providers,
    exports: providers,
})
export class UserModule {}
