import { Injectable } from "@nestjs/common";
import { Attachment, Prisma } from "@prisma/client";
import { PrismaService } from "src/infrastructure/_prisma/prisma.service";

@Injectable()
export class AttachmentRepository {
    constructor(private readonly prisma: PrismaService) {}

    // Create
    async createAttachment(input: Prisma.AttachmentCreateInput) {
        return await this.prisma.getTransaction().attachment.create({
            data: input,
        });
    }

    // CreateMany
    async createAttachments(input: Prisma.AttachmentCreateInput[]) {
        return await this.prisma.getTransaction().attachment.createMany({
            data: input,
        });
    }

    // Find
    async findAttachmentByPath(path: string): Promise<Attachment | null> {
        return await this.prisma.getTransaction().attachment.findUnique({
            where: {
                path,
            },
        });
    }

    // FindMany
    async findAttachments(
        options: Prisma.AttachmentFindManyArgs
    ): Promise<Attachment[]> {
        return await this.prisma.getTransaction().attachment.findMany(options);
    }
}
