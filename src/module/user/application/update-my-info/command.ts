import { UserModel } from "src/shared/api/user/user.domain";
import { ICommand } from "@nestjs/cqrs";
import { UserUpdateDto } from "../../dto/user-update.dto";

export class UpdateMyInfoCommand implements ICommand {
    constructor(readonly user: UserModel, readonly dto: UserUpdateDto) {}
}
