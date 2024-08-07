export async function $allOperations({
    operation,
    query,
    args,
}: {
    operation: string;
    query: (args: any) => Promise<any>;
    args: any;
}) {
    if (
        operation === "findUnique" ||
        operation === "findFirst" ||
        operation === "findMany" ||
        operation === "count"
    ) {
        if (args.where) {
            args.where = { ...args.where, deletedAt: null };
        } else {
            args.where = { deletedAt: null };
        }
        return query(args);
    }
    return query(args);
}
