import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";

import { DeactivateUserCommand } from "./command";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { isError } from "src/common/error/util/error";
import { ExpectedErrorException } from "src/common/error/exception/expected-error.exception";
import { SUCCESS_MESSAGE } from "src/shared/constant";
import { asSuccessResponse } from "src/common/response/as-success-response";
import { UserService } from "src/module/user/service/user.service";
import { UserModel } from "src/shared/api/user/user.domain";

@CommandHandler(DeactivateUserCommand)
export class DeactivateUserHandler
    implements ICommandHandler<DeactivateUserCommand, SuccessResponseDto>
{
    private logger = new Logger(DeactivateUserHandler.name);

    constructor(private readonly userService: UserService) {}

    async execute(command: DeactivateUserCommand): Promise<SuccessResponseDto> {
        const { email, password } = command.dto;

        /** 조건부 */

        // 조건 1: User 로그인 시도
        const user = await this.userService.login(email, password);
        if (isError(user)) {
            switch (user.error) {
                case "USER_NOT_FOUND": {
                    throw new ExpectedErrorException("USER_NOT_FOUND", {
                        email,
                    });
                }
                case "WRONG_PASSWORD": {
                    throw new ExpectedErrorException("WRONG_PASSWORD", {
                        email,
                    });
                }
            }
        }

        /** 실행부 */

        // 실행 1: 유저 비활성화(Soft-delete)
        await this.userService.deactivate(user.id);

        // 종료
        this.log(user);
        return asSuccessResponse(SUCCESS_MESSAGE.AUTH.USER_DEACTIVATED);
    }

    log(user: UserModel) {
        this.logger.log(
            `User deactivated: ${this.userService.summarize(user)}`
        );
    }
}
