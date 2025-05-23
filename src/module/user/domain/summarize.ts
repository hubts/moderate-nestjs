import { UserModel } from "@sdk";

export function summarize(user: UserModel): string {
    return `User (id = ${user.id}, email = ${user.email}, nickname = ${user.nickname})`;
}
