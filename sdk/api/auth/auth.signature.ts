import {
    CommonResponse,
    ForBackendInterface,
    ForFrontendApi,
} from "../../type";
import { UserJoin, UserLogin } from "./auth.interface";
import { TokenRefresh } from "./auth.interface";
import { UserAuthToken } from "./auth.interface";

export interface AuthSignature {
    // 회원가입
    joinUser(input: UserJoin): Promise<CommonResponse<UserAuthToken>>;

    // 로그인
    loginUser(input: UserLogin): Promise<CommonResponse<UserAuthToken>>;

    // 토큰 갱신
    refreshUser(input: TokenRefresh): Promise<CommonResponse<UserAuthToken>>;

    // 회원 탈퇴
    deactivateUser(): Promise<CommonResponse>;
}

export type AuthInterface = ForBackendInterface<AuthSignature>;
export type AuthApi = ForFrontendApi<AuthSignature>;
