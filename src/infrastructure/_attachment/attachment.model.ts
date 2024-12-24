import { Attachment } from "@prisma/client";

export interface AttachmentModel {
    id: string;
    savedAt: Date;
    path: string;
    filename: string;
    originalName: string;
    extension: string;
    mimeType: string;
}

export function attachmentModelMapper(attachment: Attachment): AttachmentModel {
    return {
        id: attachment.id,
        savedAt: attachment.createdAt,
        path: attachment.path,
        filename: attachment.filename,
        originalName: attachment.originalName,
        extension: attachment.extension,
        mimeType: attachment.mimeType,
    };
}
