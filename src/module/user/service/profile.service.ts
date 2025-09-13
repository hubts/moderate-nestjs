import { extname } from "path";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@sdk";
import { AttachmentService } from "src/infrastructure/_attachment/attachment.service";
import { ProfileRepository } from "../repository/profile.repository";
import { ExpectedErrorException } from "@/common/error/expected-error.exception";

@Injectable()
export class ProfileService {
    constructor(
        private readonly attachmentService: AttachmentService,
        private readonly profileRepository: ProfileRepository
    ) {}

    /**
     * 유저의 프로필 업데이트
     * - 닉네임, 모바일, 주소
     * - 프로필 이미지
     */
    async updateProfile(
        userId: string,
        input: {
            mobile?: string;
            address?: string;
            image?: Express.Multer.File;
        }
    ): Promise<void> {
        const { mobile, address, image } = input;

        // 프로필 조회
        const userProfile = await this.profileRepository.findOneByUserId(
            userId
        );
        if (!userProfile) {
            throw new ExpectedErrorException("PROFILE_NOT_FOUND", {
                userId,
            });
        }

        // 프로필 업데이트 데이터 구성
        const updateData: Prisma.ProfileUpdateInput = {};

        // 모바일 중복 검사
        if (mobile) {
            const existingMobile = await this.profileRepository.findOne({
                mobile,
            });
            if (existingMobile) {
                throw new ExpectedErrorException("USER_MOBILE_DUPLICATED", {
                    mobile,
                });
            }
            updateData.mobile = mobile;
        }

        // 프로필 이미지 업로드
        if (image) {
            const attachment = await this.attachmentService.saveAttachment(
                image.path,
                {
                    filename: image.filename,
                    originalName: image.originalname,
                    extension: extname(image.originalname).replace(".", ""),
                    mimetype: image.mimetype,
                    size: image.size,
                }
            );
            updateData.imageUrl = attachment.path;
        }

        // 주소 업데이트
        if (address) {
            updateData.address = address;
        }

        // 프로필 업데이트
        await this.profileRepository.updateByUserId(userId, updateData);
    }
}
