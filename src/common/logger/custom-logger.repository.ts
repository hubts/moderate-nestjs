import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Logging, LoggingCreateInput, LoggingDocument } from "./logging.schema";
import { Model } from "mongoose";

@Injectable()
export class CustomLoggerRepository {
    constructor(
        @InjectModel(Logging.name)
        private readonly loggingModel: Model<LoggingDocument>
    ) {}

    async create(data: LoggingCreateInput): Promise<LoggingDocument> {
        const createdLogging = new this.loggingModel(data);
        return await createdLogging.save();
    }

    async findAll(): Promise<LoggingDocument[]> {
        return await this.loggingModel.find().exec();
    }
}
