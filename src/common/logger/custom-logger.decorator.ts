import { Inject } from "@nestjs/common";
import { CustomLoggerFactory } from "./custom-logger.factory";

export function Logger(context?: string) {
    return function (target: any, propertyKey: string) {
        // 생성자에 CustomLoggerFactory 주입을 위한 데코레이터 추가
        if (!target.constructor.prototype.__logger_factory_injected) {
            Inject(CustomLoggerFactory)(target.constructor, "loggerFactory");
            target.constructor.prototype.__logger_factory_injected = true;
        }

        // getter를 통해 logger 인스턴스 생성
        Object.defineProperty(target, propertyKey, {
            get() {
                if (!this._logger) {
                    const factory = this.loggerFactory;
                    this._logger = factory.createLogger(
                        context || target.constructor.name
                    );
                }
                return this._logger;
            },
            configurable: true,
        });
    };
}
