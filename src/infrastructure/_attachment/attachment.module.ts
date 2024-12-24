import { Global, Module } from "@nestjs/common";
import { AttachmentRepository } from "./attachment.repository";
import { AttachmentService } from "./attachment.service";

@Global()
@Module({
    providers: [AttachmentService, AttachmentRepository],
    exports: [AttachmentService],
})
export class AttachmentModule {}
