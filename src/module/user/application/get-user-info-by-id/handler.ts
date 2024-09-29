import { isError } from "src/common/error/util/error";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GetUserInfoByIdCommand } from "./command";
import { UserInfoDto } from "../../dto/user-info.dto";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { UserService } from "../../service/user.service";
import { ExpectedErrorException } from "src/common/error/exception/expected-error.exception";
import { SUCCESS_MESSAGE } from "src/shared/constant";
import { asSuccessResponse } from "src/common/response/as-success-response";

@CommandHandler(GetUserInfoByIdCommand)
export class GetUserInfoByIdHandler
    implements
        ICommandHandler<
            GetUserInfoByIdCommand,
            SuccessResponseDto<UserInfoDto>
        >
{
    constructor(private readonly userService: UserService) {}

    async execute(
        command: GetUserInfoByIdCommand
    ): Promise<SuccessResponseDto<UserInfoDto>> {
        const { dto } = command;
        const { id } = dto;

        const user = await this.userService.getUserById(id);
        if (isError(user)) {
            throw new ExpectedErrorException(user.error, user.cause);
        }

        return asSuccessResponse(SUCCESS_MESSAGE.USER.FOUND, {
            id: user.id,
            joinedAt: user.joinedAt,
            email: user.email,
            nickname: user.nickname,
            role: user.role,
        });
    }
}
