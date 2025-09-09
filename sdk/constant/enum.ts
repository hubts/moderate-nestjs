export namespace Enum {
    /**
     * 유저의 역할 정의
     */
    export const UserRole = {
        USER: "USER",
        ADMIN: "ADMIN",
    } as const;
    export type UserRole = typeof UserRole[keyof typeof UserRole];
}
