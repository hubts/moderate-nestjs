import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { UserEmailParams } from "src/shared/api/user/user.api";
import { Random } from "src/shared/util/random";

export class UserEmailParamsDto implements UserEmailParams {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        example: Random.email(),
    })
    email: string;
}
