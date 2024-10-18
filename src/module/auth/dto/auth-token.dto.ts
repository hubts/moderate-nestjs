import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { AuthToken } from "src/shared/api/auth/auth.api";
import { Random } from "src/common/util/random";

export class AuthTokenDto implements AuthToken {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: Random.lowercase(64) })
    accessToken: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: Random.lowercase(32) })
    refreshToken: string;
}
