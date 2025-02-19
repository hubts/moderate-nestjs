import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsPhoneNumber } from "class-validator";
import { IsNickname } from "src/common/decorator/validator/is-nickname.decorator";
import { IsPassword } from "src/common/decorator/validator/is-password.decorator";
import { UserUpdate } from "@sdk";
import { Random } from "src/common/util/random";

export class UserUpdateDto implements UserUpdate {
    @IsOptional()
    @IsNickname()
    @ApiPropertyOptional({
        description: "Nickname",
        example: Random.nickname(),
    })
    nickname?: string;

    @IsOptional()
    @IsPassword()
    @ApiPropertyOptional({
        description: "Password",
        example: Random.lowercase(),
    })
    password?: string;

    @IsOptional()
    @IsPhoneNumber("KR")
    @ApiPropertyOptional({
        description: "Mobile",
        example: Random.phoneNumber(),
    })
    mobile?: string;
}
