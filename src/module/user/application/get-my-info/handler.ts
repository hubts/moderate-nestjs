import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GetMyInfoCommand } from "./command";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { UserService } from "../../service/user.service";
import { UserInfoWithProfileDto } from "../../dto/user-info-with-profile.dto";
import { isError } from "src/common/error/util/error";
import { ExpectedErrorException } from "src/common/error/exception/expected-error.exception";
import { SUCCESS_MESSAGE } from "src/shared/constant";
import { asSuccessResponse } from "src/common/response/as-success-response";

@CommandHandler(GetMyInfoCommand)
export class GetMyInfoHandler
    implements
        ICommandHandler<
            GetMyInfoCommand,
            SuccessResponseDto<UserInfoWithProfileDto>
        >
{
    constructor(private readonly userService: UserService) {}

    async execute(
        command: GetMyInfoCommand
    ): Promise<SuccessResponseDto<UserInfoWithProfileDto>> {
        const { user } = command;
        const { id, joinedAt, email, nickname, role } = user;

        const profile = await this.userService.getProfileByUserId(id);
        if (isError(profile)) {
            throw new ExpectedErrorException(profile.error, profile.cause);
        }

        return asSuccessResponse(SUCCESS_MESSAGE.USER.FOUND, {
            id,
            joinedAt,
            email,
            nickname,
            role,
            name: profile.name,
            mobile: profile.mobile,
            address: profile.address,
        });
    }
}
