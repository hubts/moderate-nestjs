import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail } from "class-validator";
import { IsPassword } from "src/common/decorator/validator/is-password.decorator";
import { UserLogin } from "src/shared/api/auth/auth.api";
import { Random } from "src/common/util/random";

export class UserLoginDto implements UserLogin {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: Random.email() })
    email: string;

    @IsNotEmpty()
    @IsPassword()
    @ApiProperty({ example: Random.lowercase() })
    password: string;
}
