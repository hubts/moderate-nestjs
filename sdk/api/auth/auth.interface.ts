import { Enum } from "../../constant";

// 유저 회원가입
export interface UserJoin {
    email: string;
    password: string;
}

// 유저 로그인
export interface UserLogin {
    email: string;
    password: string;
}

// 유저 JWT Payload
export interface UserJwtPayload {
    id: string;
    email: string;
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
    userId: string;
    refreshToken: string;
}
