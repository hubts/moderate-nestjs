import { ApiProperty } from "@nestjs/swagger";
import { AuthToken } from "src/shared/api/auth/auth.api";
import { Random } from "src/common/util/random";

export class AuthTokenDto implements AuthToken {
    @ApiProperty({ example: Random.lowercase(64) })
    accessToken: string;

    @ApiProperty({ example: Random.lowercase(32) })
    refreshToken: string;
}
