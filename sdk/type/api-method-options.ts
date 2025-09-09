import { RequestMethod } from "@nestjs/common";

/**
 * API Route에 대한 속성 정의
 */
export interface ApiMethodOptions<R> {
    /**
     * API HTTP Method
     * @example "GET" | "POST"
     */
    method: RequestMethod;
    /**
     * API Path (최상위 Context 아래에서 정의)
     * @example "/id/:id"
     */
    path: string;
    /**
     * Authentication (Roles)
     * 기능을 호출할 수 있는 권한(Role) 정의
     * @example ["USER", "ADMIN"]
     */
    roles?: R[];
    /**
     * Swagger
     * API에 대한 설명
     * @example ["Message for the API"]
     */
    description?: string[];
}
