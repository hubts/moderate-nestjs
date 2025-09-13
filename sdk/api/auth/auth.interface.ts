import { ValidationTag } from "../validation";
import { Enum } from "../../constant";

// 유저 회원가입
export interface UserJoin {
    email: ValidationTag.Email;
    password: ValidationTag.Password;
}

// 유저 로그인
export interface UserLogin {
    email: ValidationTag.Email;
    password: ValidationTag.Password;
}

// 유저 JWT Payload
export interface UserJwtPayload {
    id: ValidationTag.UUID;
    email: ValidationTag.Email;
    nickname: ValidationTag.Nickname;
    role: Enum.UserRole;
}

// 유저 토큰
export interface UserAuthToken {
    accessToken: ValidationTag.HexadecimalToken;
    refreshToken: ValidationTag.HexadecimalToken;
}

// 토큰 갱신
export interface TokenRefresh {
    userId: ValidationTag.UUID;
    refreshToken: ValidationTag.HexadecimalToken;
}
