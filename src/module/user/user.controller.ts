import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Param } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { GetUserInfoByIdCommand } from "./application/get-user-info-by-id/command";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { UserInfoDto } from "./dto/user-info.dto";
import { Requestor } from "src/common/decorator/auth/requestor.decorator";
import { GetUserInfoByEmailCommand } from "./application/get-user-info-by-email/command";
import { GetMyInfoCommand } from "./application/get-my-info/command";
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
import { Route } from "src/common/decorator/api/route.decorator";

@ApiTags(UserRoute.apiTags)
@Controller(UserRoute.pathPrefix)
export class UserController implements UserApi<UserModel> {
    constructor(private readonly commandBus: CommandBus) {}

    @Route.Get(UserRoute.getUserInfoById, {
        summary: "Get public information of user by ID.",
        success: {
            message: SUCCESS_MESSAGE.USER.FOUND,
            description: "Returns public information of user.",
            dataGenericType: UserInfoDto,
        },
        errors: ["USER_NOT_FOUND"],
    })
    async getUserInfoById(
        @Param() params: UserIdParamsDto
    ): Promise<SuccessResponseDto<UserInfoDto>> {
        return await this.commandBus.execute(
            new GetUserInfoByIdCommand(params)
        );
    }

    @Route.Get(UserRoute.getUserInfoByEmail, {
        summary: "Get public information of user by email",
        success: {
            message: SUCCESS_MESSAGE.USER.FOUND,
            description: "Returns public information of user.",
            dataGenericType: UserInfoDto,
        },
        errors: ["USER_NOT_FOUND"],
    })
    async getUserInfoByEmail(
        @Param() params: UserEmailParamsDto
    ): Promise<SuccessResponseDto<UserInfoDto>> {
        return await this.commandBus.execute(
            new GetUserInfoByEmailCommand(params)
        );
    }

    @Route.Get(UserRoute.getMyInfo, {
        summary: "Get user own information.",
        success: {
            message: SUCCESS_MESSAGE.USER.FOUND,
            description: "Returns user's own information.",
            dataGenericType: UserInfoWithProfileDto,
        },
        errors: ["USER_NOT_FOUND", "PROFILE_NOT_FOUND"],
    })
    async getMyInfo(
        @Requestor() requestor: UserModel
    ): Promise<SuccessResponseDto<UserInfoWithProfileDto>> {
        return await this.commandBus.execute(new GetMyInfoCommand(requestor));
    }

    @Route.Post(UserRoute.updateMyInfo, {
        summary: "Update user own information.",
        success: {
            message: SUCCESS_MESSAGE.USER.UPDATED,
            description: "User's own information will be updated.",
        },
        errors: ["USER_NICKNAME_DUPLICATED", "USER_MOBILE_DUPLICATED"],
    })
    async updateMyInfo(
        @Requestor() requestor: UserModel,
        @Body() input: UserUpdateDto
    ): Promise<CommonResponse<null>> {
        return await this.commandBus.execute(
            new UpdateMyInfoCommand(requestor, input)
        );
    }
}
