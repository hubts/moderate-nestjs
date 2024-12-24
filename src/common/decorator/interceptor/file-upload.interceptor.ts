import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiConsumes } from "@nestjs/swagger";

export interface FileUploadInterceptorOptions {
    propertyName: string;
    maxCount: number;
    fileSize: number;
    fileFilter?: (req: any, file: any, callback: any) => void;
    storage?: any;
}

export function FileUploadInterceptor(options: FileUploadInterceptorOptions) {
    const { propertyName, maxCount, fileSize, fileFilter, storage } = options;
    return applyDecorators(
        UseInterceptors(
            FilesInterceptor(propertyName, maxCount, {
                fileFilter,
                limits: {
                    files: maxCount,
                    fileSize: fileSize,
                },
                ...(storage && { storage }),
            })
        ),
        ApiConsumes("multipart/form-data")
    );
}
