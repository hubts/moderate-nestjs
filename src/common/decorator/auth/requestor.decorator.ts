import {
    ExecutionContext,
    UnauthorizedException,
    createParamDecorator,
} from "@nestjs/common";
import { User } from "@prisma/client";

/**
 * Decorator used to specify who is granted access.
 */
export const Requestor = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest() as Request & {
            user: User;
        };
        if (!request.user) {
            throw new UnauthorizedException(
                "Authentication is required to access"
            );
        }
        return request.user;
    }
);
