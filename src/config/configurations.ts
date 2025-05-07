import { JwtConfig } from "./internal/jwt.config";
import { MongooseConfig } from "./internal/mongoose.config";
import { ServerConfig } from "./internal/server.config";
import { ThrottlerConfig } from "./internal/throttler.config";

export const configurations = [
    ServerConfig,
    ThrottlerConfig,
    JwtConfig,
    MongooseConfig,
];
