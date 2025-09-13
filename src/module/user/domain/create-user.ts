import { Enum } from "@sdk";
import { fakerKO } from "@faker-js/faker";
import { hashUserPassword } from "../../auth/domain/password-manager";

/**
 * 새로운 유저 생성
 * - 닉네임 자동 생성
 * - 비밀번호 해싱
 * - 기본 USER 권한으로 생성
 */
export function createUser(input: { email: string; password: string }): {
    email: string;
    password: string;
    nickname: string;
    role: Enum.UserRole;
} {
    const { email, password } = input;

    // 랜덤 닉네임 생성
    const adjective = fakerKO.word.adjective();
    const noun = fakerKO.word.noun();
    const nickname = `${adjective}${noun}`.replaceAll(" ", "");

    return {
        email,
        password: hashUserPassword(password),
        nickname,
        role: Enum.UserRole.USER,
    };
}
