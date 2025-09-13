import { PrismaService } from "@/infrastructure/_prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@sdk";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    // Create
    async create(input: Prisma.UserCreateInput) {
        return await this.prisma.getTransaction().user.create({ data: input });
    }

    // Find one
    async findOne(where: Prisma.UserWhereUniqueInput) {
        where.deletedAt = null;
        return await this.prisma.getTransaction().user.findUnique({ where });
    }

    // Find many
    async findMany(where: Prisma.UserWhereInput) {
        where.deletedAt = null;
        return await this.prisma.getTransaction().user.findMany({ where });
    }

    // Update
    async update(id: string, data: Prisma.UserUpdateInput) {
        return await this.prisma.getTransaction().user.update({
            where: { id },
            data,
        });
    }

    // Create login history
    async createLoginHistory(data: Prisma.UserLoginHistoryCreateInput) {
        return await this.prisma.getTransaction().userLoginHistory.create({
            data,
        });
    }
}
