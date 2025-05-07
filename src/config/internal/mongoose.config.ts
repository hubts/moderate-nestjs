import { registerAs } from "@nestjs/config";
import { IMongooseConfig } from "../config.interface";
import { ConfigValidation } from "../validator/config-validation.decorator";
import { NotEmptyString } from "../validator/not-empty-string.decorator";

export const MongooseConfig = registerAs("mongo", (): IMongooseConfig => {
    const config = new MongooseConfigValidation();
    return {
        uri: config.MONGO_URL,
    };
});

@ConfigValidation()
class MongooseConfigValidation {
    @NotEmptyString()
    MONGO_URL: string;
}
