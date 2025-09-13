import { ValidationTag } from "../validation";
import { Enum } from "../../constant";

// 유저 공개 정보
export interface UserPublicInfo {
    id: ValidationTag.UUID;
    nickname: ValidationTag.Nickname;
    imageUrl: ValidationTag.Url | null;
}

// 유저 개인 정보
export interface UserPrivateInfo extends UserPublicInfo {
    role: Enum.UserRole;
    profile: UserProfile;
}

// 유저 개인 프로필
export interface UserProfile {
    name: ValidationTag.Nickname;
    address: ValidationTag.Address;
    mobile: ValidationTag.PhoneNumber;
}

// 유저 이메일
export interface UserEmail {
    email: ValidationTag.Email;
}

// 유저 정보 업데이트
export interface UserUpdate {
    nickname?: ValidationTag.Nickname;
    mobile?: ValidationTag.PhoneNumber;
    address?: ValidationTag.Address;
}
