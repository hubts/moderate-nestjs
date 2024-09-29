import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { UserRole } from "src/shared/api/user/user.domain";

/**
 * Decorator sets permissions related to access.
 * @param roles - Roles to allow to access.
 */
const Roles = (...roles: string[]) => SetMetadata("roles", roles);

/**
 * A bundle of decorators that verify user access.
 * @param roles - Roles of the user to allow access.
 */
export function JwtRolesAuth(roles: UserRole[]) {
    if (roles.length) {
        return applyDecorators(
            Roles(...roles),
            UseGuards(JwtAuthGuard, RolesGuard),
            ApiBearerAuth()
        );
    }
    return applyDecorators();
}
