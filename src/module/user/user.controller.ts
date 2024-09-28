import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { GetUserInfoByIdCommand } from "./application/get-user-info-by-id/command";
import { JwtRolesAuth } from "src/common/decorator/auth/jwt-roles-auth.decorator";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { UserInfoDto } from "./dto/user-info.dto";
import { Requestor } from "src/common/decorator/auth/requestor.decorator";
import { GetUserInfoByEmailCommand } from "./application/get-user-info-by-email/command";
import { GetMyInfoCommand } from "./application/get-my-info/command";
import { ApiSpec } from "src/common/decorator/api/api-spec.decorator";
import { UserRoute } from "src/shared/api/user/user.route";
import { UserApi } from "src/shared/api/user/user.api";
import { UserModel } from "src/shared/api/user/user.domain";
import { SUCCESS_MESSAGE } from "src/shared/constant";
import { CommonResponse } from "src/shared/type";
import { UserIdParamsDto } from "./dto/user-id-params.dto";
import { UserEmailParamsDto } from "./dto/user-email-params.dto";
import { UserInfoWithProfileDto } from "./dto/user-info-with-profile.dto";
import { UserUpdateDto } from "./dto/user-update.dto";
import { UpdateMyInfoCommand } from "./application/update-my-info/command";

@ApiTags(UserRoute.apiTags)
@Controller(UserRoute.pathPrefix)
export class UserController implements UserApi<UserModel> {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiSpec({
        summary: "Get public information of user by ID.",
        description: UserRoute.getUserInfoById.description,
        success: {
            message: SUCCESS_MESSAGE.USER.FOUND,
            description: "Returns public information of user.",
            dataGenericType: UserInfoDto,
        },
        errors: ["USER_NOT_FOUND"],
    })
    @JwtRolesAuth(UserRoute.getUserInfoById.roles)
    @Get(UserRoute.getUserInfoById.subRoute)
    async getUserInfoById(
        @Param() params: UserIdParamsDto
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
        errors: ["USER_NOT_FOUND"],
    })
    @JwtRolesAuth(UserRoute.getUserInfoByEmail.roles)
    @Get(UserRoute.getUserInfoByEmail.subRoute)
    async getUserInfoByEmail(
        @Param() params: UserEmailParamsDto
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
            dataGenericType: UserInfoWithProfileDto,
        },
        errors: ["USER_NOT_FOUND", "PROFILE_NOT_FOUND"],
    })
    @JwtRolesAuth(UserRoute.getMyInfo.roles)
    @Get(UserRoute.getMyInfo.subRoute)
    async getMyInfo(
        @Requestor() user: UserModel
    ): Promise<SuccessResponseDto<UserInfoWithProfileDto>> {
        return await this.commandBus.execute(new GetMyInfoCommand(user));
    }

    @ApiSpec({
        summary: "Update user own information.",
        description: UserRoute.updateMyInfo.description,
        success: {
            message: SUCCESS_MESSAGE.USER.UPDATED,
            description: "User's own information will be updated.",
        },
        errors: ["DUPLICATE_NICKNAME", "DUPLICATE_MOBILE"],
    })
    @JwtRolesAuth(UserRoute.updateMyInfo.roles)
    @Post(UserRoute.updateMyInfo.subRoute)
    async updateMyInfo(
        @Requestor() requestor: UserModel,
        @Body() input: UserUpdateDto
    ): Promise<CommonResponse<null>> {
        return await this.commandBus.execute(
            new UpdateMyInfoCommand(requestor, input)
        );
    }
}
