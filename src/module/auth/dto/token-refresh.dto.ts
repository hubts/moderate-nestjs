import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { TokenRefresh } from "src/shared/api/auth/auth.api";
import { Random } from "src/shared/util/random";

export class TokenRefreshDto implements TokenRefresh {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ example: Random.uuid() })
    userId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: Random.hex(16) })
    refreshToken: string;
}
