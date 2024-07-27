import { ResponseCode, ResponseName } from "./response.type";

/**
 * @description
 * 성공, 실패, 예측 에러에 대하여 API가 공통적으로 반환하는 응답 인터페이스입니다.
 * 성공의 경우 데이터가 존재하거나 존재하지 않을 수 있으며, 실패 및 예측 에러의 경우 null 값을 가집니다.
 */
export interface IResponse<T> {
    success: boolean;
    code: ResponseCode;
    name: ResponseName;
    message: string;
    data: T | null;
}
