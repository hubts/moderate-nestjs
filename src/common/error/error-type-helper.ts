import { ERROR } from "src/shared/constant";
import { ErrorName } from "src/shared/type";

// 에러 이름 배열
export const ErrorNames = Object.keys(ERROR) as ErrorName[];

// 에러 반환에 대한 타입 정의
export type ReturnError<T extends ErrorName, R extends object = object> = {
    error: T;
    cause?: R;
};

/**
 * @description
 * 입력 값이 에러인지 검사하는 타입 가드.
 *
 * @param value - 에러로 예상되는 입력 값 (e.g. 특정 함수의 반환된 결과가 성공이거나, 에러일 수 있음).
 * @returns 에러 타입으로 간주되거나, 아닌 경우 원래의 성공 타입으로 간주됨.
 */
export function isError<T>(
    value: T | ReturnError<ErrorName>
): value is ReturnError<ErrorName> {
    return (
        !!value &&
        typeof value === "object" &&
        "error" in value &&
        typeof value.error === "string" &&
        ErrorNames.includes(value.error as ErrorName)
    );
}
