import { extname } from "path";
import { Injectable } from "@nestjs/common";
import { AttachmentService } from "src/infrastructure/_attachment/attachment.service";
import { AttachmentModel } from "src/infrastructure/_attachment/attachment.model";

@Injectable()
export class ProfileAttachmentService {
    constructor(private readonly attachmentService: AttachmentService) {}

    async uploadProfileImage(
        image: Express.Multer.File
    ): Promise<AttachmentModel> {
        return await this.attachmentService.saveAttachment(image.path, {
            filename: image.filename,
            originalName: image.originalname,
            extension: extname(image.originalname).replace(".", ""),
            mimetype: image.mimetype,
            size: image.size,
        });
    }
}
