import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { ApiConsumes } from "@nestjs/swagger";
import { getMulterOptions } from "src/config/internal/multer.config.service";

export interface FileUploadInterceptorOptions {
    fieldname: string;
    filesCountLimit: number;
    eachFileSizeLimit: number;
    storage?: MulterOptions["storage"];
    eachFileFilter?: MulterOptions["fileFilter"];
}

export function FileUploadInterceptor(options: FileUploadInterceptorOptions) {
    const {
        fieldname,
        filesCountLimit,
        eachFileSizeLimit,
        eachFileFilter,
        storage,
    } = options;
    const multerOptions: MulterOptions = {
        limits: {
            files: filesCountLimit,
            fileSize: eachFileSizeLimit,
        },
        storage,
        ...(eachFileFilter && { fileFilter: eachFileFilter }),
        ...getMulterOptions(),
    };

    if (filesCountLimit === 1) {
        return applyDecorators(
            UseInterceptors(FileInterceptor(fieldname, multerOptions)),
            ApiConsumes("multipart/form-data")
        );
    } else {
        return applyDecorators(
            UseInterceptors(
                FilesInterceptor(fieldname, filesCountLimit, multerOptions)
            ),
            ApiConsumes("multipart/form-data")
        );
    }
}
