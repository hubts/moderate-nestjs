import { extname } from "path";
import { ExpectedErrorException } from "src/common/error/expected-error.exception";
import { Random } from "src/common/util/random";

export const imageFileFilter = (
    _: any,
    file: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
    },
    callback: (error: Error | null, acceptFile: boolean) => void
) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(
            new ExpectedErrorException(
                "BAD_REQUEST",
                { file },
                "Image file only allowed"
            ),
            false
        );
    }
    callback(null, true);
};

export const editFilename = (
    _: any,
    file: {
        originalname: string;
    },
    callback: (error: Error | null, filename: string) => void
) => {
    const { originalname } = file;
    const extension = extname(originalname);
    const randomName = Random.uuid();
    callback(null, `${randomName}${extension}`);
};
