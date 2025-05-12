import { LogLevel } from "@nestjs/common";
import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LoggingDocument = HydratedDocument<Logging>;

@Schema({
    timestamps: {
        createdAt: "createdAt",
    },
})
export class Logging {
    @Prop({ required: true, unique: true })
    id: string;

    @Prop({ required: true })
    level: LogLevel;

    @Prop({ required: true })
    message: string;

    @Prop(raw({}))
    request?: Record<string, any>;

    @Prop(raw({}))
    response?: Record<string, any>;

    @Prop(raw({}))
    cause?: Record<string, any>;
}

export const LoggingSchema = SchemaFactory.createForClass(Logging);

export type LoggingCreateInput = Pick<
    Logging,
    "level" | "message" | "request" | "response" | "cause"
> & {
    id?: string;
};
