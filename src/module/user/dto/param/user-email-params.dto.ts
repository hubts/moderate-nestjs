import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { UserEmailParams } from "@sdk";
import { Random } from "src/common/util/random";

export class UserEmailParamsDto implements UserEmailParams {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        example: Random.email(),
    })
    email: string;
}
