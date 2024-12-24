import { Injectable } from "@nestjs/common";
import {
    ApiToService,
    UserApi,
    UserEmailParams,
    UserIdParams,
    UserInfo,
    UserInfoWithProfile,
    UserModel,
    UserUpdate,
} from "src/shared";
import { ExpectedErrorException } from "src/common/error/expected-error.exception";
import { isError } from "src/common/error/error-type-helper";
import { UserQueryService } from "./provider/service/user-query.service";
import { UserCommandService } from "./provider/service/user-command.service";
import { ProfileQueryService } from "./provider/service/profile-query.service";
import { ProfileCommandService } from "./provider/service/profile-command.service";

@Injectable()
export class UserService implements ApiToService<UserApi<UserModel>> {
    constructor(
        private readonly userQuery: UserQueryService,
        private readonly userCommand: UserCommandService,
        private readonly profileQuery: ProfileQueryService,
        private readonly profileCommand: ProfileCommandService
    ) {}

    async getUserInfoById(params: UserIdParams): Promise<UserInfo> {
        const { id } = params;
        const user = await this.userQuery.getUserById(id);
        return {
            id: user.id,
            joinedAt: user.joinedAt,
            email: user.email,
            nickname: user.nickname,
            role: user.role,
        };
    }

    async getUserInfoByEmail(params: UserEmailParams): Promise<UserInfo> {
        const { email } = params;
        const user = await this.userQuery.getUserByEmail(email);
        return {
            id: user.id,
            joinedAt: user.joinedAt,
            email: user.email,
            nickname: user.nickname,
            role: user.role,
        };
    }

    async getMyInfo(user: UserModel): Promise<UserInfoWithProfile> {
        const { id, joinedAt, email, nickname, role } = user;
        const profile = await this.profileQuery.getProfileByUserId(id);
        if (isError(profile)) {
            throw new ExpectedErrorException(profile.error, profile.cause);
        }

        return {
            id,
            joinedAt,
            email,
            nickname,
            role,
            name: profile.name,
            mobile: profile.mobile,
            address: profile.address,
        };
    }

    async updateMyInfo(user: UserModel, input: UserUpdate): Promise<null> {
        const { id } = user;
        const { nickname, mobile, address } = input;

        const duplication = await this.userQuery.existsBy({
            nickname: nickname ?? "",
            mobile: mobile ?? "",
            name: "",
            email: "",
        });
        if (duplication.exists) {
            switch (duplication.reason) {
                case "nickname":
                    throw new ExpectedErrorException(
                        "USER_NICKNAME_DUPLICATED",
                        {
                            nickname,
                        }
                    );
                case "mobile":
                    throw new ExpectedErrorException("USER_MOBILE_DUPLICATED", {
                        mobile,
                    });
                default:
                    throw new ExpectedErrorException("INTERNAL_SERVER_ERROR", {
                        userId: user.id,
                        input,
                        duplication,
                    });
            }
        }

        const profile = await this.profileQuery.getProfileByUserId(id);

        if (nickname) {
            await this.userCommand.updateNickname(user.id, nickname);
        }

        if (mobile) {
            await this.profileCommand.updateMobile(profile.id, mobile);
        }

        if (address) {
            await this.profileCommand.updateAddress(profile.id, address);
        }

        return null;
    }
}
