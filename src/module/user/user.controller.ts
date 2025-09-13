import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Param } from "@nestjs/common";
import {
    UserRoute,
    SUCCESS_MESSAGE,
    UserInterface,
    User,
    UserPrivateInfo,
    UserUpdate,
    UserPublicInfo,
} from "@sdk";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { Requestor } from "src/common/decorator/auth/requestor.decorator";
import { Route } from "src/common/decorator/api/route.decorator";
import { asSuccessResponse } from "src/common/response/as-success-response";
import { UserFacade } from "./user.facade";
import typia from "typia";

@ApiTags(UserRoute.apiTags)
@Controller(UserRoute.context)
export class UserController implements UserInterface {
    constructor(private readonly userFacade: UserFacade) {}

    @Route.Get(UserRoute.getMyInfo, {
        summary: "내 정보 찾기",
        success: {
            message: SUCCESS_MESSAGE.USER.FOUND,
            description: "내 공개/개인 정보",
            example: typia.random<UserPrivateInfo>(),
        },
        errors: ["USER_NOT_FOUND", "PROFILE_NOT_FOUND"],
    })
    async getMyInfo(
        @Requestor() requestor: User
    ): Promise<SuccessResponseDto<UserPrivateInfo>> {
        const data = await this.userFacade.getMyInfo(requestor);
        return asSuccessResponse(SUCCESS_MESSAGE.USER.FOUND, data);
    }

    @Route.Patch(UserRoute.updateMyInfo, {
        summary: "내 정보 업데이트",
        success: {
            message: SUCCESS_MESSAGE.USER.UPDATED,
            description: "내 공개/개인 정보 업데이트",
        },
        errors: ["USER_NICKNAME_DUPLICATED", "USER_MOBILE_DUPLICATED"],
        request: {
            body: typia.random<UserUpdate>(),
        },
    })
    async updateMyInfo(
        @Body() input: UserUpdate,
        @Requestor() requestor: User
    ): Promise<SuccessResponseDto> {
        typia.assert<UserUpdate>(input);
        await this.userFacade.updateMyInfo(requestor, input);
        return asSuccessResponse(SUCCESS_MESSAGE.USER.UPDATED);
    }

    @Route.Get(UserRoute.getUserInfoById, {
        summary: "유저 정보 조회 by ID",
        success: {
            message: SUCCESS_MESSAGE.USER.FOUND,
            description: "유저 공개 정보",
            example: typia.random<UserPublicInfo>(),
        },
        errors: ["USER_NOT_FOUND"],
    })
    async getUserInfoById(
        @Param("id") id: string
    ): Promise<SuccessResponseDto<UserPublicInfo>> {
        const result = await this.userFacade.getUserInfoById(id);
        return asSuccessResponse(SUCCESS_MESSAGE.USER.FOUND, result);
    }

    @Route.Get(UserRoute.getUserInfoByEmail, {
        summary: "유저 정보 조회 by 이메일",
        success: {
            message: SUCCESS_MESSAGE.USER.FOUND,
            description: "유저 공개 정보",
            example: typia.random<UserPublicInfo>(),
        },
        errors: ["USER_NOT_FOUND"],
    })
    async getUserInfoByEmail(
        @Param("email") email: string
    ): Promise<SuccessResponseDto<UserPublicInfo>> {
        const result = await this.userFacade.getUserInfoByEmail(email);
        return asSuccessResponse(SUCCESS_MESSAGE.USER.FOUND, result);
    }
}
