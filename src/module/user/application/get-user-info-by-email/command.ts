import { ICommand } from "@nestjs/cqrs";
import { UserEmailParamsDto } from "../../dto/user-email-params.dto";

export class GetUserInfoByEmailCommand implements ICommand {
    constructor(readonly dto: UserEmailParamsDto) {}
}
