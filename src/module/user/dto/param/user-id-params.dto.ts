import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { UserIdParams } from "@sdk";
import { Random } from "src/common/util/random";

export class UserIdParamsDto implements UserIdParams {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        example: Random.uuid(),
    })
    id: string;
}
