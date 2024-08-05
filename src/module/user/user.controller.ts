import { ApiTags } from "@nestjs/swagger";
import { Controller, Get, HttpStatus, Param } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { GetUserInfoByIdCommand } from "./application/get-user-info-by-id/command";
import { UserIdParam } from "./dto/user-id.param";
import { JwtRolesAuth } from "src/common/decorator/auth/jwt-roles-auth.decorator";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { UserInfoDto } from "./dto/user-info.dto";
import { Requestor } from "src/common/decorator/auth/requestor.decorator";
import { User } from "@prisma/client";
import { UserEmailParam } from "./dto/user-email.param";
import { GetUserInfoByEmailCommand } from "./application/get-user-info-by-email/command";
import { MyUserInfoDto } from "./dto/my-info.dto";
import { GetMyInfoCommand } from "./application/get-my-info/command";
import { SUCCESS_MESSAGE } from "src/shared/api/constant/success-message.constant";
import { ApiSpec } from "src/common/decorator/api/api-spec.decorator";
import { UserApi } from "src/shared/api/user.api";
import { UserRoute } from "src/shared/api/user.route";

@ApiTags(UserRoute.apiTags)
@Controller(UserRoute.pathPrefix)
export class UserController implements UserApi<User> {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiSpec({
        summary: "Get public information of user by ID.",
        description: UserRoute.getUserInfoById.description,
        success: {
            message: SUCCESS_MESSAGE.USER.FOUND,
            description: "Returns public information of user.",
            dataGenericType: UserInfoDto,
        },
        failures: [
            {
                status: HttpStatus.NOT_FOUND,
                examples: [
                    {
                        name: "USER_NOT_FOUND",
                        description: "When the user does not exist.",
                    },
                ],
            },
        ],
    })
    @JwtRolesAuth(UserRoute.getUserInfoById.roles)
    @Get(UserRoute.getUserInfoById.subRoute)
    async getUserInfoById(
        @Param() params: UserIdParam
    ): Promise<SuccessResponseDto<UserInfoDto>> {
        return await this.commandBus.execute(
            new GetUserInfoByIdCommand(params)
        );
    }

    @ApiSpec({
        summary: "Get public information of user by email",
        description: UserRoute.getUserInfoByEmail.description,
        success: {
            message: SUCCESS_MESSAGE.USER.FOUND,
            description: "Returns public information of user.",
            dataGenericType: UserInfoDto,
        },
        failures: [
            {
                status: HttpStatus.NOT_FOUND,
                examples: [
                    {
                        name: "USER_NOT_FOUND",
                        description: "When the user does not exist.",
                    },
                ],
            },
        ],
    })
    @JwtRolesAuth(UserRoute.getUserInfoByEmail.roles)
    @Get(UserRoute.getUserInfoByEmail.subRoute)
    async getUserInfoByEmail(
        @Param() params: UserEmailParam
    ): Promise<SuccessResponseDto<UserInfoDto>> {
        return await this.commandBus.execute(
            new GetUserInfoByEmailCommand(params)
        );
    }

    @ApiSpec({
        summary: "Get user own information.",
        description: UserRoute.getMyInfo.description,
        success: {
            message: SUCCESS_MESSAGE.USER.FOUND,
            description: "Returns user's own information.",
            dataGenericType: MyUserInfoDto,
        },
        failures: [
            {
                status: HttpStatus.NOT_FOUND,
                examples: [
                    {
                        name: "USER_NOT_FOUND",
                        description:
                            "When the login user not found (may be attack).",
                    },
                    {
                        name: "PROFILE_NOT_FOUND",
                        description:
                            "When the profile not found (may be attack).",
                    },
                ],
            },
        ],
    })
    @JwtRolesAuth(UserRoute.getMyInfo.roles)
    @Get(UserRoute.getMyInfo.subRoute)
    async getMyInfo(
        @Requestor() user: User
    ): Promise<SuccessResponseDto<MyUserInfoDto>> {
        return await this.commandBus.execute(new GetMyInfoCommand(user));
    }
}
