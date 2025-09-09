import { Injectable } from "@nestjs/common";
import { Prisma } from "@sdk";
import { PrismaService } from "src/infrastructure/_prisma/prisma.service";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    // Create
    async createUser(input: Prisma.UserCreateInput) {
        return await this.prisma.getTransaction().user.create({ data: input });
    }

    // Find
    async findUserByUnique(where: Prisma.UserWhereUniqueInput) {
        return await this.prisma.getTransaction().user.findUnique({ where });
    }

    // Find & Relation(Profile)
    async findUserAndProfileByUserId(id: string) {
        return await this.prisma
            .getTransaction()
            .user.findUnique({ where: { id }, include: { Profile: true } });
    }

    // Find & Relation(Login History)
    async findUserAndLoginHistoriesByUserId(id: string) {
        return await this.prisma.getTransaction().user.findUnique({
            where: { id },
            include: { UserLoginHistories: true },
        });
    }

    // FindMany by unique
    async findManyUsersByUnique(options: {
        email: string;
        nickname: string;
        name: string;
        mobile: string;
    }) {
        const { email, nickname, mobile, name } = options;
        return await this.prisma.user.findMany({
            select: {
                email: true,
                nickname: true,
                Profile: {
                    select: {
                        name: true,
                        mobile: true,
                    },
                },
            },
            where: {
                OR: [
                    { email },
                    { nickname },
                    { Profile: { mobile } },
                    { Profile: { name } },
                ],
            },
        });
    }

    // Update
    async updateUser(id: string, data: Prisma.UserUpdateInput) {
        return await this.prisma.getTransaction().user.update({
            where: { id },
            data,
        });
    }

    // Delete
    async deleteUser(id: string) {
        await this.prisma
            .getTransaction()
            .profile.delete({ where: { userId: id } });
        await this.prisma
            .getTransaction()
            .userLoginHistory.deleteMany({ where: { userId: id } });
        await this.prisma.getTransaction().user.delete({ where: { id } });
    }
}
