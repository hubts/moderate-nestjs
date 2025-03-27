import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { TokenRefresh } from "@sdk";
import { Random } from "src/common/util/random";

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
