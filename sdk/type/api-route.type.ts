import { CommonResponse } from "./common-response.interface";

/**
 * 다루는 API HTTP Method
 */
export type HttpMethod = "GET" | "POST";

/**
 * API Route에 대한 속성 정의
 */
export interface ApiRouteOptions<R> {
    /**
     * API HTTP Method
     */
    method: HttpMethod;
    /**
     * 최상위 Route 아래의 Path
     */
    subRoute: string;
    /**
     * 기능을 호출할 수 있는 권한(Role) 정의
     */
    roles: R[];
    /**
     * API에 대한 설명
     */
    description: string[];
}

/**
 * 특정 도메인에서 구현할 API Route들의 타입 정의
 * 이 타입은 클라이언트가 호출하는 Request 서비스, 서버 내 컨트롤러 구현 등에 이용될 수 있다.
 */
export type ApiRoute<T, R> = {
    /**
     * Swagger에 명시되는 API Tags
     */
    apiTags: string;
    /**
     * 특정 도메인 API Route의 최상위 Path Prefix
     */
    pathPrefix: string;
} & {
    /**
     * 구현하는 각 API에 대한 속성 정의
     */
    [key in keyof T]: ApiRouteOptions<R>;
};

/**
 * 특정 도메인에서 구현하기 위해 이용되는 API Route 목록에서, 공통 응답 타입을 제거한 타입
 */
export type ApiToService<T> = {
    [K in keyof T]: T[K] extends (
        ...args: infer P
    ) => Promise<CommonResponse<infer R>>
        ? (...args: P) => Promise<R>
        : never;
};

/**
 * 특정 도메인에서 구현하기 위해 이용되는 서비스 기능에서, 공통 응답 타입을 추가하는 타입
 */
export type ServiceToApi<T> = {
    [K in keyof T]: T[K] extends (...args: infer P) => Promise<infer R>
        ? (...args: P) => Promise<CommonResponse<R>>
        : never;
};

export interface SuccessExample<T> {
    message: string;
    description: string;
    example: T;
}

export type SuccessExamples<T> = SuccessExample<T>[];
