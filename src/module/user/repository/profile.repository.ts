import { Injectable } from "@nestjs/common";
import { Prisma } from "@sdk";
import { PrismaService } from "src/infrastructure/_prisma/prisma.service";

@Injectable()
export class ProfileRepository {
    constructor(private readonly prisma: PrismaService) {}

    // Create
    async create(input: Prisma.ProfileCreateInput) {
        return await this.prisma
            .getTransaction()
            .profile.create({ data: input });
    }

    // Find one
    async findOne(where: Prisma.ProfileWhereUniqueInput) {
        where.deletedAt = null;
        return await this.prisma.getTransaction().profile.findUnique({ where });
    }

    // Find one by user ID
    async findOneByUserId(userId: string) {
        return await this.prisma
            .getTransaction()
            .profile.findUnique({ where: { userId, deletedAt: null } });
    }

    // Update
    async update(id: string, input: Prisma.ProfileUpdateInput) {
        return await this.prisma
            .getTransaction()
            .profile.update({ where: { id }, data: input });
    }

    // Update by user ID
    async updateByUserId(userId: string, input: Prisma.ProfileUpdateInput) {
        return await this.prisma
            .getTransaction()
            .profile.update({ where: { userId }, data: input });
    }
}
