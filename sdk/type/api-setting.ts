import { ApiMethodOptions } from "./api-method-options";

/**
 * 특정 도메인에서 구현할 API Route들의 타입 정의
 * 이 타입은 클라이언트가 호출하는 Request 서비스, 서버 내 컨트롤러 구현 등에 이용될 수 있다.
 */
export type ApiSetting<T, R = undefined> = {
    /**
     * Swagger에 명시되는 API Tags
     * @example "User", "유저"
     */
    apiTags: string;
    /**
     * 특정 도메인의 최상위 Context
     * @example "users", "auth"
     */
    context: string;
} & {
    /**
     * 구현하는 각 API에 대한 속성 정의
     * @example "getMyInfo"
     */
    [key in keyof T]: ApiMethodOptions<R>;
};
