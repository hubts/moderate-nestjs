export interface LogOptions {
    context?: string;
    stack?: string;
    detail?: LogOptionsDetail;
}

export interface LogOptionsDetail {
    save?: boolean;
    cause?: Record<string, any> | object;
    request?: Record<string, any> | object;
    response?: Record<string, any> | object;
}
