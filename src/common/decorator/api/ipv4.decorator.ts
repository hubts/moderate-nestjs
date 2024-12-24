import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Ipv4 = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        const forwarded = request.headers["x-forwarded-for"] as string;
        const ip = forwarded ? forwarded.split(",")[0].trim() : request.ip;
        if (ip && ip.startsWith("::ffff:")) {
            return ip.substring(7);
        }
        return ip;
    }
);
