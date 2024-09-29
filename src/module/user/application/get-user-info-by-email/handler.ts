import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GetUserInfoByEmailCommand } from "./command";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { UserInfoDto } from "../../dto/user-info.dto";
import { UserService } from "../../service/user.service";
import { isError } from "src/common/error/util/error";
import { ExpectedErrorException } from "src/common/error/exception/expected-error.exception";
import { SUCCESS_MESSAGE } from "src/shared/constant";
import { asSuccessResponse } from "src/common/response/as-success-response";

@CommandHandler(GetUserInfoByEmailCommand)
export class GetUserInfoByEmailHandler
    implements
        ICommandHandler<
            GetUserInfoByEmailCommand,
            SuccessResponseDto<UserInfoDto>
        >
{
    constructor(private readonly userService: UserService) {}

    async execute(
        command: GetUserInfoByEmailCommand
    ): Promise<SuccessResponseDto<UserInfoDto>> {
        const { dto } = command;
        const { email } = dto;

        const userByEmail = await this.userService.getUserByEmail(email);
        if (isError(userByEmail)) {
            throw new ExpectedErrorException(
                userByEmail.error,
                userByEmail.cause
            );
        }

        return asSuccessResponse(SUCCESS_MESSAGE.USER.FOUND, {
            id: userByEmail.id,
            joinedAt: userByEmail.joinedAt,
            email: userByEmail.email,
            nickname: userByEmail.nickname,
            role: userByEmail.role,
        });
    }
}
