import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SwaggerSetupOptions } from "./interface";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";

export function setupSwagger(
    app: NestExpressApplication,
    options: SwaggerSetupOptions
): void {
    const {
        path,
        theme,
        serverUrl,
        localhostPort,
        title,
        description,
        version,
        extraModels,
    } = options;

    // Setup the configurations.
    const swaggerConfig = new DocumentBuilder();
    if (serverUrl) {
        swaggerConfig.addServer(serverUrl);
    } else if (localhostPort) {
        swaggerConfig.addServer(`http://localhost:${localhostPort}`);
    }
    if (title) {
        swaggerConfig.setTitle(title);
    }
    if (description) {
        swaggerConfig.setDescription(description);
    }
    if (version) {
        swaggerConfig.setVersion(version);
    }

    // JWT
    swaggerConfig.addBearerAuth({
        type: "http",
        bearerFormat: "JWT",
    });
    const swaggerDocument = SwaggerModule.createDocument(
        app,
        swaggerConfig.build(),
        {
            extraModels: extraModels ?? [],
        }
    );

    // NOTE: You can change the style of swagger from here.
    const style = new SwaggerTheme().getBuffer(
        theme ?? SwaggerThemeNameEnum.CLASSIC
    );

    // Finally
    SwaggerModule.setup(path, app, swaggerDocument, {
        explorer: true,
        customCss: style,
        swaggerOptions: {
            tagsSorter: "alpha",
            // operationsSorter: "alpha",
        },
    });
}
