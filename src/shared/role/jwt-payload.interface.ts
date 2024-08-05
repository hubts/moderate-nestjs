import { Role } from "./user-role.type";

export interface JwtPayload {
    id: string;
    nickname: string;
    role: Role;
}
