import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { join } from "path";
import { ApiSetting } from "../type";

// 추가 옵션 타입 정의
export interface ApiWrapperOptions {
    defaultConfig?: AxiosRequestConfig;
    transformResponse?: <T>(response: AxiosResponse<T>) => T;
    transformError?: (error: any) => any;
}

// 개별 요청별 옵션
export interface RequestOptions extends AxiosRequestConfig {
    skipDefaultConfig?: boolean; // 기본 설정을 무시하고 싶을 때
    pathParams?: Record<string, any>; // URL path에 들어갈 파라미터
}

// 특정 도메인에 대한 API 경로 생성 함수
function buildPath<T, R>(
    setting: ApiSetting<T, R>,
    methodName: keyof ApiSetting<T, R>,
    pathParams?: Record<string, any>
) {
    return join(setting.context, setting[methodName].path).replace(
        /:(\w+)/g,
        (_, key) => pathParams?.[key] || ""
    );
}

// 설정 병합 유틸리티
function mergeConfigs(
    defaultConfig?: AxiosRequestConfig,
    requestConfig?: RequestOptions
): AxiosRequestConfig {
    if (requestConfig?.skipDefaultConfig) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { skipDefaultConfig, pathParams, ...config } = requestConfig;
        return config;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { skipDefaultConfig, pathParams, ...config } = requestConfig || {};

    return {
        ...defaultConfig,
        ...config,
        headers: {
            ...defaultConfig?.headers,
            ...config?.headers,
        },
        params: {
            ...defaultConfig?.params,
            ...config?.params,
        },
    };
}

export const createApiWrapper = <T, R>(
    client: AxiosInstance,
    setting: ApiSetting<T, R>,
    options?: ApiWrapperOptions
) => {
    const {
        defaultConfig,
        transformResponse = <T>(res: AxiosResponse<T>) => res.data,
        transformError = (err: any) => {
            throw err;
        },
    } = options || {};

    const get = async <R>(
        functionName: keyof T,
        requestOptions?: RequestOptions
    ): Promise<R> => {
        const config = mergeConfigs(defaultConfig, requestOptions);
        const path = buildPath(
            setting,
            functionName,
            requestOptions?.pathParams
        );

        try {
            const response = await client.get<R>(path, config);
            return transformResponse(response);
        } catch (error) {
            return transformError(error);
        }
    };

    const post = async <I, R>(
        functionName: keyof T,
        data?: I,
        requestOptions?: RequestOptions
    ): Promise<R> => {
        const config = mergeConfigs(defaultConfig, requestOptions);
        const path = buildPath(
            setting,
            functionName,
            requestOptions?.pathParams
        );

        try {
            const response = await client.post<R>(path, data, config);
            return transformResponse(response);
        } catch (error) {
            return transformError(error);
        }
    };

    const patch = async <I, R>(
        functionName: keyof T,
        data?: I,
        requestOptions?: RequestOptions
    ): Promise<R> => {
        const config = mergeConfigs(defaultConfig, requestOptions);
        const path = buildPath(
            setting,
            functionName,
            requestOptions?.pathParams
        );

        try {
            const response = await client.patch<R>(path, data, config);
            return transformResponse(response);
        } catch (error) {
            return transformError(error);
        }
    };

    const put = async <I, R>(
        functionName: keyof T,
        data?: I,
        requestOptions?: RequestOptions
    ): Promise<R> => {
        const config = mergeConfigs(defaultConfig, requestOptions);
        const path = buildPath(
            setting,
            functionName,
            requestOptions?.pathParams
        );

        try {
            const response = await client.put<R>(path, data, config);
            return transformResponse(response);
        } catch (error) {
            return transformError(error);
        }
    };

    const del = async <R>(
        functionName: keyof T,
        requestOptions?: RequestOptions
    ): Promise<R> => {
        const config = mergeConfigs(defaultConfig, requestOptions);
        const path = buildPath(
            setting,
            functionName,
            requestOptions?.pathParams
        );

        try {
            const response = await client.delete<R>(path, config);
            return transformResponse(response);
        } catch (error) {
            return transformError(error);
        }
    };

    // 원본 client와 설정에 접근할 수 있는 메서드들
    const getClient = () => client;
    const getDefaultConfig = () => defaultConfig;
    const withOptions = (newOptions: Partial<ApiWrapperOptions>) =>
        createApiWrapper(client, setting, { ...options, ...newOptions });

    return {
        get,
        post,
        patch,
        put,
        delete: del,
        // 유틸리티 메서드들
        getClient,
        getDefaultConfig,
        withOptions,
    };
};

export const createAxiosInstance = (baseURL: string) => {
    return axios.create({
        baseURL,
    });
};
