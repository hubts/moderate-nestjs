import { ApiProperty } from "@nestjs/swagger";
import { UserInfo, UserRole, UserRoles } from "@sdk";
import { Random } from "src/common/util/random";

export class UserInfoDto implements UserInfo {
    @ApiProperty({
        description: "User ID",
        example: Random.uuid(),
    })
    id: string;

    @ApiProperty({
        description: "When you joined at",
        example: Random.dateBetween(),
    })
    joinedAt: Date;

    @ApiProperty({
        description: "Email",
        example: Random.email(),
    })
    email: string;

    @ApiProperty({
        description: "Nickname",
        example: Random.nickname(),
    })
    nickname: string;

    @ApiProperty({
        description: `UserRole: ${UserRoles}`,
        example: UserRoles[0],
    })
    role: UserRole;
}
