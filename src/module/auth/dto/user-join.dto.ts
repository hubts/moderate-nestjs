import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsPhoneNumber } from "class-validator";
import { IsNickname } from "src/common/decorator/validator/is-nickname.decorator";
import { IsPassword } from "src/common/decorator/validator/is-password.decorator";
import { IUserJoinDto } from "src/shared/api/auth.api";
import { Random } from "src/shared/util/random";

export class UserJoinDto implements IUserJoinDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: "Your email (never used)",
        example: Random.email(),
    })
    email: string;

    @IsNotEmpty()
    @IsPassword()
    @ApiProperty({
        description: "Your password",
        example: Random.lowercase(6) + Random.digits(4),
    })
    password: string;

    @IsNotEmpty()
    @IsNickname()
    @ApiProperty({
        description: "Your nickname (never used)",
        example: Random.nickname(),
    })
    nickname: string;

    @IsNotEmpty()
    @IsPhoneNumber("KR")
    @ApiProperty({
        description: "Your mobile (never used)",
        pattern: `010-XXXX-XXXX`,
        example: Random.phoneNumber(),
    })
    mobile: string;
}
