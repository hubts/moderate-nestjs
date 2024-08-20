import { ApiProperty } from "@nestjs/swagger";
import { CommonResponse } from "src/shared/api/interface";
import { ResponseCode, SuccessCode, SuccessName } from "src/shared/api/lib";

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
