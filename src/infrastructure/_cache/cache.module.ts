import { Global, Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { PrismaModule } from "../_prisma/prisma.module";
import { CacheRepository } from "./cache.repository";

@Global()
@Module({
    imports: [
        /**
         * Cache의 기능을 살리려면,
         * ScheduleModule을 활성화하여 만료된 데이터를 삭제시켜야 합니다.
         */
        // ScheduleModule.forRoot(),
        PrismaModule,
    ],
    providers: [CacheRepository, CacheService],
    exports: [CacheService],
})
export class CacheModule {}
