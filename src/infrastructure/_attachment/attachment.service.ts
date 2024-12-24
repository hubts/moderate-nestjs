import { Injectable } from "@nestjs/common";
import { basename, extname } from "path";
import { AttachmentRepository } from "./attachment.repository";
import { AttachmentModel, attachmentModelMapper } from "./attachment.model";

@Injectable()
export class AttachmentService {
    constructor(private readonly attachmentRepo: AttachmentRepository) {}

    /**
     * 첨부파일 저장
     */
    async saveAttachment(
        path: string,
        options?: {
            filename?: string;
            originalName?: string;
            extension?: string;
            mimetype?: string;
            size?: number;
        }
    ): Promise<AttachmentModel> {
        const alreadyExistingAttachment =
            await this.attachmentRepo.findAttachmentByPath(path);
        if (alreadyExistingAttachment) {
            throw new Error(`Attachment path already exists`);
        }
        const result = await this.attachmentRepo.createAttachment({
            path,
            filename: options?.filename ?? basename(path),
            originalName: options?.originalName ?? basename(path),
            extension: options?.extension ?? extname(path).replace(".", ""),
            mimeType: options?.mimetype ?? "application/octet-stream",
            size: options?.size ?? 0,
        });
        return attachmentModelMapper(result);
    }

    /**
     * 첨부파일 조회
     */
    async getAttachmentByPath(path: string): Promise<AttachmentModel | null> {
        const attachment = await this.attachmentRepo.findAttachmentByPath(path);
        if (!attachment) {
            return null;
        }
        return attachmentModelMapper(attachment);
    }

    /**
     * 첨부파일 다중 건
     */
    async getAttachments(
        skip: number,
        take: number
    ): Promise<AttachmentModel[]> {
        const attachments = await this.attachmentRepo.findAttachments({
            skip,
            take,
        });
        return attachments.map(attachmentModelMapper);
    }
}
