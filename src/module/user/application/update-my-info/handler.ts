import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { UpdateMyInfoCommand } from "./command";
import { UserService } from "../../service/user.service";
import { TransactionManager } from "src/infrastructure/prisma/util/transaction.manager";
import { asSuccessResponse } from "src/common/response/as-success-response";
import { SUCCESS_MESSAGE } from "src/shared/constant";
import { ExpectedErrorException } from "src/common/error/exception/expected-error.exception";

@CommandHandler(UpdateMyInfoCommand)
export class UpdateMyInfoHandler
    implements ICommandHandler<UpdateMyInfoCommand, SuccessResponseDto>
{
    constructor(
        private readonly txm: TransactionManager,
        private readonly userService: UserService
    ) {}

    async execute(
        command: UpdateMyInfoCommand
    ): Promise<SuccessResponseDto<null>> {
        const { user, dto } = command;
        const { nickname, password, mobile } = dto;

        const duplication = await this.userService.existsBy({
            nickname: nickname ?? "",
            mobile: mobile ?? "",
            name: "",
            email: "",
        });
        if (duplication.exists) {
            switch (duplication.firstReason) {
                case "nickname":
                    throw new ExpectedErrorException(
                        "USER_NICKNAME_DUPLICATED",
                        {
                            nickname,
                        }
                    );
                case "mobile":
                    throw new ExpectedErrorException("USER_MOBILE_DUPLICATED", {
                        mobile,
                    });
            }
        }

        if (nickname) {
            await this.userService.updateNickname(user.id, nickname);
        }

        if (password) {
            await this.userService.updatePassword(user.id, password);
        }

        if (mobile) {
            await this.userService.updateMobile(user.id, mobile);
        }

        return asSuccessResponse(SUCCESS_MESSAGE.USER.UPDATED);
    }
}
