import { ICommand } from "@nestjs/cqrs";
import { UserIdParamsDto } from "../../dto/user-id-params.dto";

export class GetUserInfoByIdCommand implements ICommand {
    constructor(readonly dto: UserIdParamsDto) {}
}
