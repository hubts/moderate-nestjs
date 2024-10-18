import { UserRole } from "../api";

/**
 * JWT payload interface.
 * If you want to change the payload in access token, change this interface.
 */
export interface JwtPayload {
    id: string;
    nickname: string;
    role: UserRole;
}
