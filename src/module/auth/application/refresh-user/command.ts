import { ICommand } from "@nestjs/cqrs";
import { TokenRefreshDto } from "../../dto/token-refresh.dto";

export class RefreshUserCommand implements ICommand {
    constructor(readonly dto: TokenRefreshDto) {}
}
