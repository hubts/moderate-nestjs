import { Address, Email, Nickname, PhoneNumber } from "api/validation";

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
    email: Email;
}

// 유저 정보 업데이트
export interface UserUpdate {
    nickname?: Nickname;
    mobile?: PhoneNumber;
    address?: Address;
}
