import { Prisma } from "@prisma/client";
import { softDelete } from "./extension/soft-delete";
import { softDeleteMany } from "./extension/soft-delete-many";
import { $allOperations } from "./extension/filter-soft-deleted";

// Extension for soft delete
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

// Extension for filtering soft deleted rows from queries
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
