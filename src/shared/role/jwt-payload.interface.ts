import { UserRole } from "../api/user/user.domain";

export interface JwtPayload {
    id: string;
    nickname: string;
    role: UserRole;
}
