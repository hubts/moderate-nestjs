/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    Min,
} from "class-validator";
import { Paginated, PaginationOptions } from "@sdk";

export class PaginationOptionsDto implements PaginationOptions {
    @IsOptional()
    @IsInt()
    @Min(0)
    @Transform(({ value }) => {
        if (!value) return 0;
        return Number(value);
    })
    @ApiPropertyOptional({
        description: "건너뛰는 데이터의 개수 단위 (Page)",
        example: 0,
        default: 0,
    })
    skip: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => {
        if (!value) return 10;
        return Number(value);
    })
    @ApiPropertyOptional({
        description: "가져올 데이터의 개수 (Size)",
        example: 10,
        default: 10,
    })
    take: number;
}

export abstract class PaginatedDto<T> implements Paginated<T> {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: "데이터의 총 개수",
        example: 1,
    })
    total: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: "현재 조회된 데이터의 개수",
        example: 1,
    })
    size: number;

    @IsNotEmpty()
    @IsArray()
    @ApiProperty()
    list: T[];
}
