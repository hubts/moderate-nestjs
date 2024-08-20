import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";
import { User } from "@prisma/client";

import { DeactivateUserCommand } from "./command";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { UserService } from "src/module/user/domain/user.service";
import { checkUserPassword } from "src/module/user/domain/user-password-manager";
import { SUCCESS_MESSAGE } from "src/shared/api/constant";
import { isFailureName } from "src/shared/api/lib";
import { ExpectedBadRequestException } from "src/common/error/exception/expected-failure.exception";

@CommandHandler(DeactivateUserCommand)
export class DeactivateUserHandler
    implements ICommandHandler<DeactivateUserCommand, SuccessResponseDto<void>>
{
    private logger = new Logger(DeactivateUserHandler.name);

    constructor(private readonly userService: UserService) {}

    async execute(
        command: DeactivateUserCommand
    ): Promise<SuccessResponseDto<void>> {
        const { email, password } = command.dto;

        /** 조건부 */

        // 조건 1: User 존재 확인
        const user = await this.userService.getUserByEmail(email);
        if (isFailureName(user)) {
            throw new ExpectedBadRequestException("UNREGISTERED_EMAIL");
        }

        // 조건 2: 비밀번호 확인
        const isPasswordCorrect = checkUserPassword(user.password, password);
        if (!isPasswordCorrect) {
            throw new ExpectedBadRequestException("WRONG_PASSWORD");
        }

        /** 실행부 */

        // 실행 1: 유저 비활성화(Soft-delete)
        await this.userService.deactivate(user.id);

        // 종료
        this.log(user);
        return new SuccessResponseDto(SUCCESS_MESSAGE.AUTH.USER_DEACTIVATED);
    }

    log(user: User) {
        this.logger.log(
            `User deactivated: ${this.userService.summarize(user)}`
        );
    }
}
