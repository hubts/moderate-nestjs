import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminTestGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authorization: string = request.headers.authorization;
        if (!authorization) {
            return false;
        }

        const appSecret = authorization.replace("Bearer ", "");
        if (!appSecret) {
            return false;
        }

        return appSecret === this.configService.get<string>("SECRET");
    }
}
