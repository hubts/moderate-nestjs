import { DynamicModule, Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { TransactionManager } from "./util/transaction.manager";
import { PRISMA_MODULE_OPTIONS } from "./module/prisma.constant";
import { PrismaModuleOptions } from "./module/prisma-module-options.interface";

@Global()
@Module({
    providers: [
        PrismaService,
        TransactionManager,
        {
            provide: PRISMA_MODULE_OPTIONS,
            useValue: {},
        },
    ],
    exports: [PrismaService, TransactionManager],
})
export class PrismaModule {
    static forRoot(options: PrismaModuleOptions): DynamicModule {
        return {
            module: PrismaModule,
            global: options.global ?? false,
            providers: [
                {
                    provide: PRISMA_MODULE_OPTIONS,
                    useValue: options || {},
                },
            ],
        };
    }
}
