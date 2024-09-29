import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { UserIdParams } from "src/shared/api/user/user.api";
import { Random } from "src/shared/util/random";

export class UserIdParamsDto implements UserIdParams {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        example: Random.uuid(),
    })
    id: string;
}
