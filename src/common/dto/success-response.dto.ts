import { ApiProperty } from "@nestjs/swagger";
import { SuccessCode, SuccessName } from "@sdk";
import { CommonResponse, ResponseCode, ResponseName } from "@sdk";

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
    name = SuccessName as ResponseName;

    @ApiProperty()
    message: string;

    data: T | null;

    constructor(message: string, data?: T) {
        this.message = message;
        this.data = data ?? null;
    }
}
