/**
 * @description
 * 구현하는 API Route에 대한 타입 정의
 * 이 타입은 Client 호출 Request 서비스나, 서버 내 Controller에 대한 구현을 위해 이용됩니다.
 */
export type ApiRoute<T, R> = {
    apiTags: string;
    pathPrefix: string;
} & {
    // Method names
    [key in keyof T]: {
        subRoute: string; // Sub route path
        roles: R[]; // Roles for permission
        description: string[]; // Description for the method
    };
};
