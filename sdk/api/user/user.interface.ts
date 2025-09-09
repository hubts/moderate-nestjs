// 유저 공개 정보
export interface UserPublicInfo {
    id: string;
    joinedAt: Date;
    email: string;
    nickname: string;
}

// 유저 개인 정보
export interface UserPrivateInfo extends UserPublicInfo {
    profile: UserProfile;
}

// 유저 개인 프로필
export interface UserProfile {
    name: string;
    address: string;
    mobile: string;
}

// 유저 이메일
export interface UserEmail {
    email: string;
}

// 유저 정보 업데이트
export interface UserUpdate {
    nickname?: string;
    mobile?: string;
    address?: string;
}
