export const checkUserPropsExist = (
    users: {
        email: string;
        nickname: string;
        mobile: string | null;
        name: string | null;
    }[],
    where: {
        email: string;
        nickname: string;
        mobile: string;
        name: string;
    }
): {
    exists: boolean;
    firstReason: "email" | "nickname" | "mobile" | "name" | null;
} => {
    if (!users.length) {
        return {
            exists: false,
            firstReason: null,
        };
    }

    const { email, nickname, mobile } = where;
    return {
        exists: true,
        firstReason: users.find(user => user.email === email)
            ? "email"
            : users.find(user => user.nickname === nickname)
            ? "nickname"
            : users.find(user => user.mobile === mobile)
            ? "mobile"
            : users.find(user => user.name === where.name)
            ? "name"
            : null,
    };
};
