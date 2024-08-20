import { Role } from "./user.role";

export interface JwtPayload {
    id: string;
    nickname: string;
    role: Role;
}
