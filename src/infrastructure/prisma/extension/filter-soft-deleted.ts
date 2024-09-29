/**
 * SoftDelete된 데이터를 제외하고 조회하도록 하는 확장 함수
 *
 * @description
 * 특정 Model에 대한 모든 조회 쿼리에 대하여, SoftDelete된 데이터를 제외하고 조회합니다.
 * 실제로는 'deletedAt' 필드가 null인 데이터만 조회합니다.
 */
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
