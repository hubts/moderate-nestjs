export interface SwaggerSetupOptions {
    path: string;
    serverUrl?: string;
    localhostPort?: number;
    title?: string;
    description?: string;
    version?: string;
    extraModels?: Function[];
}
