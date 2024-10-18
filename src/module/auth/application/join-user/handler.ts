import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JoinUserCommand } from "./command";
import { Logger } from "@nestjs/common";
import { AuthService } from "../../service/auth.service";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { AuthTokenDto } from "../../dto/auth-token.dto";
import { ExpectedErrorException } from "src/common/error/exception/expected-error.exception";
import { SUCCESS_MESSAGE } from "src/shared/constant";
import { asSuccessResponse } from "src/common/response/as-success-response";
import { UserService } from "src/module/user/service/user.service";
import { UserModel } from "src/shared/api/user/user.domain";

@CommandHandler(JoinUserCommand)
export class JoinUserHandler
    implements
        ICommandHandler<JoinUserCommand, SuccessResponseDto<AuthTokenDto>>
{
    private logger = new Logger(JoinUserHandler.name);

    constructor(
        private authService: AuthService,
        private userService: UserService
    ) {}

    async execute(
        command: JoinUserCommand
    ): Promise<SuccessResponseDto<AuthTokenDto>> {
        const { dto } = command;
        const { email, nickname, password, mobile, name, address } = dto;

        /** 조건부 */

        // 조건 1: 이메일, 닉네임, 모바일의 중복 여부 확인
        const duplication = await this.userService.existsBy({
            email,
            nickname,
            mobile,
            name,
        });
        if (duplication.exists) {
            switch (duplication.firstReason) {
                case "email":
                    throw new ExpectedErrorException("USER_EMAIL_DUPLICATED", {
                        email,
                    });
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

        /** 실행부 */

        // 유저의 새로운 회원가입은 우선적으로 수행되어도 되기 때문에, 트랜잭션을 적용하지 않는다.
        // (로그인 토큰 발행에서 발생하는 에러로 인해 유저 정보의 등록이 막히는 것보다 유저의 불편한 재입력을 제거하는 것이 낫다.)

        // 실행 1: User 신규 생성
        const newUser = await this.userService.join({
            email,
            password,
            nickname,
            mobile,
            name,
            address,
        });

        // 실행 2: 로그인 토큰 발행
        const { accessToken, refreshToken } =
            this.authService.issueAuthTokens(newUser);

        // 종료
        this.log(newUser);
        return asSuccessResponse(SUCCESS_MESSAGE.AUTH.JOIN_USER, {
            accessToken,
            refreshToken,
        });
    }

    log(user: UserModel) {
        this.logger.log(
            `New user arrived: ${this.userService.summarize(user)}`
        );
    }
}
