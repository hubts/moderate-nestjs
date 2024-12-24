import { UserInfoWithProfile } from "src/shared/api/user/user.api";
import { UserInfoDto } from "./user-info.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Random } from "src/common/util/random";

export class UserInfoWithProfileDto
    extends UserInfoDto
    implements UserInfoWithProfile
{
    @ApiProperty({
        description: "Name",
        example: "John Doe",
    })
    name: string;

    @ApiProperty({
        description: "Address",
        example: "Seoul, Korea",
    })
    address: string;

    @ApiProperty({
        description: "Your mobile",
        example: Random.phoneNumber(),
    })
    mobile: string;
}
