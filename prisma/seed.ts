/**
 * [ Prisma Seed ]
 * 이곳에서 Prisma Client를 이용하여, 서버에서 필요한 Seed 값들을 데이터베이스에 추가할 수 있습니다.
 * 서버를 구동하기 위해 필요한 기본 값 및 세팅들을 추가하거나, 데이터들을 업데이트하는 등 가벼운 작업 또한 수행 가능합니다.
 *
 * Reference: https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
 */
import { PrismaClient } from "@sdk";

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log(`Existing users ...(${users.length})`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
