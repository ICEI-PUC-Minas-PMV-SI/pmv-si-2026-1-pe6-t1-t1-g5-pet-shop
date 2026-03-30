import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Pet Flow API",
        description: "Documentação da API para o Sistema de Pet Shop",
    },
    host: "localhost:3000",
    schemes: ["http"],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
