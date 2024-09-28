import { ICommand } from "@nestjs/cqrs";
import { UserModel } from "src/shared/api/user/user.domain";

export class GetMyInfoCommand implements ICommand {
    constructor(readonly user: UserModel) {}
}
