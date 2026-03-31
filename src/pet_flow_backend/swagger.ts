import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Pet Flow API",
        description: "Documentação da API para o Sistema de Pet Shop - Financial Module Refactored",
        version: "1.0.0"
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
    definitions: {
        FinancialTransactionRequest: {
            type: "object",
            required: ["schedulingId", "category", "description", "amount", "clinicId"],
            properties: {
                schedulingId: { "type": "string", "format": "uuid" },
                category: { "type": "string" },
                description: { "type": "string" },
                amount: { "type": "number", "format": "double" },
                paymentDate: { "type": "string", "format": "date" },
                paymentMethod: { "type": "string" },
                clinicId: { "type": "string", "format": "uuid" }
            }
        },
        FinancialTransactionResponse: {
            type: "object",
            properties: {
                id: { "type": "string", "format": "uuid" },
                schedulingId: { "type": "string", "format": "uuid" },
                category: { "type": "string" },
                description: { "type": "string" },
                amount: { "type": "number", "format": "double" },
                paymentDate: { "type": "string", "format": "date" },
                paymentMethod: { "type": "string" },
                employeeId: { "type": "string", "format": "uuid" },
                clinicId: { "type": "string", "format": "uuid" },
                createdAt: { "type": "string", "format": "date-time" }
            }
        }
    }
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
