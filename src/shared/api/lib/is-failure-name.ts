import {
    FailureName,
    FailureNames,
    ReturnFailureWithCause,
} from "./response.type-helper";

/**
 * 입력 값이 FailureName인지 검사하는 타입 가드
 * @param value - FailureName으로 예상되는 입력 값 (e.g. 특정 함수 결과가 성공이거나, FailureName일 수 있음).
 * @returns FailureName 타입으로 간주되거나, 아닌 경우 원래의 성공 타입으로 간주됨.
 */
export const isFailureName = <T>(
    value: T | FailureName
): value is FailureName => {
    return (
        !!value &&
        typeof value === "string" &&
        FailureNames.includes(value as FailureName)
    );
};

export const isFailureNameWithCause = <T>(
    value: T | ReturnFailureWithCause<FailureName>
): value is ReturnFailureWithCause<FailureName> => {
    return (
        !!value &&
        typeof value === "object" &&
        "failureName" in value &&
        isFailureName(value.failureName)
    );
};
