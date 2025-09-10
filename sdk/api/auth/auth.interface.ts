import { Email, Password, Nickname } from "api/validation";
import { Enum } from "../../constant";

// 유저 회원가입
export interface UserJoin {
    email: Email;
    password: Password;
    nickname: Nickname;
}

// 유저 로그인
export interface UserLogin {
    email: Email;
    password: Password;
}

// 유저 JWT Payload
export interface UserJwtPayload {
    id: string;
    nickname: string;
    role: Enum.UserRole;
}

// 유저 토큰
export interface UserAuthToken {
    accessToken: string;
    refreshToken: string;
}

// 토큰 갱신
export interface TokenRefresh {
    refreshToken: string;
}
