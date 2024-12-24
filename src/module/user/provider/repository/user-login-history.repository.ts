import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/infrastructure/_prisma/prisma.service";

@Injectable()
export class UserLoginHistoryRepository {
    constructor(private readonly prisma: PrismaService) {}

    // Create
    async createUserLoginHistory(input: Prisma.UserLoginHistoryCreateInput) {
        return await this.prisma
            .getTransaction()
            .userLoginHistory.create({ data: input });
    }
}
