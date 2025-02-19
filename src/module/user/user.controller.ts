import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Param } from "@nestjs/common";
import { UserRoute, UserApi, UserModel, SUCCESS_MESSAGE } from "@sdk";

import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { UserInfoDto } from "./dto/response/user-info.dto";
import { Requestor } from "src/common/decorator/auth/requestor.decorator";
import { UserIdParamsDto } from "./dto/param/user-id-params.dto";
import { UserEmailParamsDto } from "./dto/param/user-email-params.dto";
import { UserInfoWithProfileDto } from "./dto/response/user-info-with-profile.dto";
import { UserUpdateDto } from "./dto/body/user-update.dto";
import { Route } from "src/common/decorator/api/route.decorator";
import { UserService } from "./user.service";
import { asSuccessResponse } from "src/common/response/as-success-response";

@ApiTags(UserRoute.apiTags)
@Controller(UserRoute.pathPrefix)
export class UserController implements UserApi<UserModel> {
    constructor(private readonly userService: UserService) {}

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
        const result = await this.userService.getUserInfoById(params);
        return asSuccessResponse(SUCCESS_MESSAGE.USER.FOUND, result);
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
        const result = await this.userService.getUserInfoByEmail(params);
        return asSuccessResponse(SUCCESS_MESSAGE.USER.FOUND, result);
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
        const data = await this.userService.getMyInfo(requestor);
        return asSuccessResponse(SUCCESS_MESSAGE.USER.FOUND, data);
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
    ): Promise<SuccessResponseDto> {
        await this.userService.updateMyInfo(requestor, input);
        return asSuccessResponse(SUCCESS_MESSAGE.USER.UPDATED);
    }
}
