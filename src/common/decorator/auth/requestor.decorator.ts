import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { ExpectedErrorException } from "src/common/error/exception/expected-error.exception";
import { UserModel } from "src/shared/api/user/user.domain";

/**
 * Decorator used to specify who is granted access.
 */
export const Requestor = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest() as Request & {
            user?: UserModel;
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
