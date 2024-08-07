import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GetUserInfoByIdCommand } from "./command";
import { UserService } from "../../domain/user.service";
import { UserInfoDto } from "../../dto/user-info.dto";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { SUCCESS_MESSAGE } from "src/shared/api/constant/success-message.constant";
import { ExpectedNotFoundException } from "src/common/error/exception/expected-failure.exception";

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
        const { id } = command.dto;

        const user = await this.userService.getUserById(id);
        if (!user) {
            throw new ExpectedNotFoundException("USER_NOT_FOUND");
        }

        return new SuccessResponseDto(SUCCESS_MESSAGE.USER.FOUND, {
            user: {
                id: user.id,
                joinedAt: user.createdAt,
                email: user.email,
                nickname: user.nickname,
            },
        });
    }
}
