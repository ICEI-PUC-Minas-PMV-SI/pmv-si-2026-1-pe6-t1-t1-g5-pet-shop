import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Pet Flow API",
        description: "Documentação da API para o Sistema de Pet Shop",
        version: "1.1.0"
    },
    host: "localhost:3000",
    basePath: "/api/v1",
    schemes: ["http"],
    securityDefinitions: {
        Bearer: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description: "Insira o token JWT no formato: Bearer {token}"
        }
    },
    definitions: {}
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
