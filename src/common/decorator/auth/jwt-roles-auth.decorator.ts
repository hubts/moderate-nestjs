import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";

/**
 * Decorator sets permissions related to access.
 * @param roles - Roles to allow to access.
 */
const Roles = <R>(...roles: R[]) => SetMetadata("roles", roles);

/**
 * A bundle of decorators that verify user access.
 * @param roles - Roles of the user to allow access.
 */
export function JwtRolesAuth<R>(roles?: R[]) {
    if (roles?.length) {
        return applyDecorators(
            // Set roles metadata
            Roles(...roles),
            // Use guards - JWT authentication and roles
            UseGuards(JwtAuthGuard, RolesGuard),
            // Set bearer authentication in Swagger
            ApiBearerAuth()
        );
    }
    return applyDecorators();
}
