import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { ExpectedErrorException } from "src/common/error/expected-error.exception";
import { User } from "@sdk";

/**
 * Decorator used to specify who is granted access.
 */
export const Requestor = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest() as Request & {
            user?: User;
        };
        if (!request.user) {
            throw new ExpectedErrorException(
                "UNAUTHORIZED",
                undefined,
                "User not found"
            );
        }
        return request.user;
    }
);
