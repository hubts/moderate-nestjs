import { UserLoginDto } from "./user-login.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { IsNickname } from "src/common/decorator/validator/is-nickname.decorator";
import { UserJoin } from "src/shared/api/auth/auth.api";
import { Random } from "src/shared/util/random";

export class UserJoinDto extends UserLoginDto implements UserJoin {
    @IsNotEmpty()
    @IsNickname()
    @ApiProperty({
        description: "Your nickname (never used)",
        example: Random.nickname(),
    })
    nickname: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Name",
        example: "John Doe",
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Address",
        example: "Seoul, Korea",
    })
    address: string;

    @IsNotEmpty()
    @IsPhoneNumber("KR")
    @ApiProperty({
        description: "Your mobile (never used)",
        pattern: `010-XXXX-XXXX`,
        example: Random.phoneNumber(),
    })
    mobile: string;
}
