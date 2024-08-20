import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GetMyInfoCommand } from "./command";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { MyUserInfoDto } from "../../dto/my-info.dto";
import { UserService } from "../../domain/user.service";
import { SUCCESS_MESSAGE } from "src/shared/api/constant/success-message.constant";
import { ExpectedNotFoundException } from "src/common/error/exception/expected-failure.exception";
import { isFailureName } from "src/shared/api/lib";

@CommandHandler(GetMyInfoCommand)
export class GetMyInfoHandler
    implements
        ICommandHandler<GetMyInfoCommand, SuccessResponseDto<MyUserInfoDto>>
{
    constructor(private readonly userService: UserService) {}

    async execute(
        command: GetMyInfoCommand
    ): Promise<SuccessResponseDto<MyUserInfoDto>> {
        const { id } = command.user;

        const userWithProfile = await this.userService.getUserWithProfileById(
            id
        );
        if (isFailureName(userWithProfile)) {
            throw new ExpectedNotFoundException(userWithProfile);
        }

        return new SuccessResponseDto(SUCCESS_MESSAGE.USER.FOUND, {
            user: {
                id: userWithProfile.id,
                joinedAt: userWithProfile.createdAt,
                email: userWithProfile.email,
                nickname: userWithProfile.nickname,
                mobile: userWithProfile.Profile.mobile,
            },
        });
    }
}
