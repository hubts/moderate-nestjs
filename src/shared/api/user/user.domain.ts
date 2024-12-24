export interface UserModel {
    id: string;
    email: string;
    nickname: string;
    joinedAt: Date;
    role: UserRole;
    loginHistories: UserLoginHistoryModel[];
    profile: UserProfileModel | null;
}

export const UserRoles = ["USER", "ADMIN"] as const;
export type UserRole = typeof UserRoles[number];

export interface UserLoginHistoryModel {
    id: string;
    userId: string;
    loggedAt: Date;
    ip: string;
    userAgent: string;
}

export interface UserProfileModel {
    id: string;
    userId: string;
    updatedAt: Date;
    name: string;
    address: string;
    mobile: string;
    imageUrl: string | null;
}
