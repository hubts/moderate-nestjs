import { Injectable, ArgumentMetadata, ValidationPipe } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { ExpectedErrorException } from "../error/expected-error.exception";

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
    constructor() {
        super({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        });
    }

    async transform(value: any, { metatype, type }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype) || type === "custom") {
            return value;
        }

        const transformed = plainToClass(metatype, value);
        const errors = await validate(transformed, {
            skipNullProperties: false, // If property is null, would you let me in?
            skipMissingProperties: false, // If property is missed, would you let me in?
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        });

        if (errors.length > 0) {
            const records: {
                property: string;
                value: any;
                messages: string[];
            }[] = [];
            this.searchErrorConstraints(errors, records);
            const firstErrorMessage = records[0].messages[0];
            throw new ExpectedErrorException(
                "BAD_REQUEST",
                {
                    message: "Payload validation failed",
                    errors: records.reduce(
                        (prev: string[], curr) => prev.concat(curr.messages),
                        []
                    ),
                },
                firstErrorMessage
            );
        }

        return transformed;
    }

    searchErrorConstraints(
        errors: ValidationError[],
        records: {
            property: string;
            value: any;
            messages: string[];
        }[]
    ): void {
        for (const error of errors) {
            if (error.constraints) {
                records.push({
                    property: error.property,
                    value: error.value,
                    messages: Object.values(error.constraints),
                });
            } else if (error.children) {
                this.searchErrorConstraints(error.children, records);
            }
        }
    }

    toValidate(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type);
    }
}
