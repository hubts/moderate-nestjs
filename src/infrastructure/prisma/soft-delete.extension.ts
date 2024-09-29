import { Prisma } from "@prisma/client";
import { softDelete } from "./extension/soft-delete";
import { softDeleteMany } from "./extension/soft-delete-many";
import { $allOperations } from "./extension/filter-soft-deleted";

/**
 * SoftDelete 기능 사용을 위한 Extension
 *
 * @description
 * 특정 Model에 대하여 SoftDelete 기능을 적용합니다.
 * 특정 Model에 대하여 SoftDeleteMany 기능을 적용합니다.
 */
export const softDeleteExtension = Prisma.defineExtension({
    name: "softDelete",
    model: {
        user: {
            softDelete,
            softDeleteMany,
        },
        profile: {
            softDelete,
            softDeleteMany,
        },
    },
});

/**
 * SoftDelete된 데이터를 제외하고 조회하도록 하는 Extension
 *
 * @description
 * 특정 Model에 대하여 SoftDelete Filter 기능을 적용합니다.
 */
export const filterSoftDeletedExtension = Prisma.defineExtension({
    name: "filterSoftDeleted",
    query: {
        user: {
            $allOperations,
        },
        profile: {
            $allOperations,
        },
    },
});
