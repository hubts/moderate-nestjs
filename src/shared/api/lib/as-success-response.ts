import { CommonResponse } from "../interface/common-response.interface";
import { SuccessCode, SuccessName } from "./response.type-helper";

export const asSuccessResponse = <T>(
    message: string,
    data: T | null = null
): CommonResponse<T> => {
    return {
        success: true,
        code: SuccessCode,
        name: SuccessName,
        message,
        data,
    };
};
