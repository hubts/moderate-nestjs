import { CommonResponse } from "src/shared/api/interface/common-response.interface";
import {
    ResponseCode,
    SuccessCode,
    SuccessName,
} from "src/shared/api/lib/response.type-helper";
import { ApiProperty } from "@nestjs/swagger";

export class SuccessResponseDto<T = null> implements CommonResponse<T> {
    @ApiProperty({
        type: Boolean,
        example: true,
        description: "Success or not",
    })
    success = true;

    @ApiProperty({
        type: String,
        example: SuccessCode,
    })
    code = SuccessCode as ResponseCode;

    @ApiProperty({
        type: String,
        example: SuccessName,
    })
    name = SuccessName;

    @ApiProperty()
    message: string;

    data: T | null;

    constructor(message: string, data?: T) {
        this.message = message;
        this.data = data ?? null;
    }
}
