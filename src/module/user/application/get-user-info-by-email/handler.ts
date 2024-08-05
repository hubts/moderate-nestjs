import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GetUserInfoByEmailCommand } from "./command";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { UserInfoDto } from "../../dto/user-info.dto";
import { UserService } from "../../domain/user.service";
import { SUCCESS_MESSAGE } from "src/shared/api/constant/success-message.constant";
import { ExpectedNotFoundException } from "src/common/error/exception/expected-failure.exception";
import { isFailureName } from "src/shared/api/lib/is-failure-name";

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
        const { email } = command.dto;

        const userByEmail = await this.userService.getUserByEmail(email);
        if (isFailureName(userByEmail)) {
            throw new ExpectedNotFoundException(userByEmail);
        }

        return new SuccessResponseDto(SUCCESS_MESSAGE.USER.FOUND, {
            user: {
                id: userByEmail.id,
                joinedAt: userByEmail.createdAt,
                email: userByEmail.email,
                nickname: userByEmail.nickname,
            },
        });
    }
}
