import { RequestOptions } from "../util";

/**
 * 백엔드에서 Controller 구현 시, API 타입에 추가 파라미터를 넣을 수 있도록 확장하는 타입
 */
export type ForBackendInterface<T, ExtraArgs = any> = {
    [K in keyof T]: T[K] extends (...args: infer P) => Promise<infer R>
        ? (...args: [...P, ...ExtraArgs[]]) => Promise<R>
        : never;
};

/**
 * 프론트엔드에서 요청 옵션을 추가할 수 있도록 확장하는 타입
 */
export type ForFrontendApi<T> = {
    [K in keyof T]: T[K] extends (...args: infer P) => Promise<infer R>
        ? (...args: [...P, RequestOptions?]) => Promise<R>
        : never;
};
