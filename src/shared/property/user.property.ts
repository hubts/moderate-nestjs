export const USER_PROPERTY_LENGTH: {
    [key in "NICKNAME" | "PASSWORD"]: {
        MIN: number;
        MAX: number;
    };
} = {
    NICKNAME: { MIN: 4, MAX: 20 },
    PASSWORD: { MIN: 4, MAX: 20 },
};

export const USER_PROPERTY_PATTERN = {
    NICKNAME: `^[a-z|0-9]{${USER_PROPERTY_LENGTH.NICKNAME.MIN},${USER_PROPERTY_LENGTH.NICKNAME.MAX}}$`,
    PASSWORD: `^[a-z|0-9]{${USER_PROPERTY_LENGTH.PASSWORD.MIN},${USER_PROPERTY_LENGTH.PASSWORD.MAX}}$`,
};
