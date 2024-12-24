import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/infrastructure/_prisma/prisma.service";

@Injectable()
export class ProfileRepository {
    constructor(private readonly prisma: PrismaService) {}

    // Create
    async createProfile(input: Prisma.ProfileCreateInput) {
        return await this.prisma
            .getTransaction()
            .profile.create({ data: input });
    }

    // Find
    async findProfileByUnique(where: Prisma.ProfileWhereUniqueInput) {
        return await this.prisma.getTransaction().profile.findUnique({ where });
    }

    // Update
    async updateProfileById(id: string, input: Prisma.ProfileUpdateInput) {
        return await this.prisma
            .getTransaction()
            .profile.update({ where: { id }, data: input });
    }

    // Update
    async updateProfileByUserId(
        userId: string,
        input: Prisma.ProfileUpdateInput
    ) {
        return await this.prisma
            .getTransaction()
            .profile.update({ where: { userId }, data: input });
    }
}
