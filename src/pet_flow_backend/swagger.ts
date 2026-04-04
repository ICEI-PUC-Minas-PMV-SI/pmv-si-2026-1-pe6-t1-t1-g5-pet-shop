import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Pet Flow API",
        description: "Documentação oficial da API do sistema Pet Flow para gestão de pet shops. Inclui módulos de Autenticação e Gestão Financeira.",
        version: "1.2.0"
    },
    host: "petflow-beta.vercel.app",
    basePath: "/api/v1",
    schemes: ["https", "http"],
    securityDefinitions: {
        Bearer: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description: "Insira o token JWT no formato: Bearer {token}"
        }
    },
    tags: [
        { name: "Autenticação", description: "Gestão de acesso e registro de funcionários" },
        { name: "Financeiro", description: "Controle de transações financeiras e fluxo de caixa" }
    ],
    definitions: {
        LoginRequest: {
            email: "funcionario@exemplo.com",
            password: "minhasenha123"
        },
        RegisterRequest: {
            clinicId: "uuid-da-clinica",
            name: "Nome do Funcionário",
            email: "novo@exemplo.com",
            password: "senha-segura",
            role: "Atendente",
            phone: "11988887777"
        },
        AuthResponse: {
            user_id: "uuid-do-usuario",
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        },
        FinancialListRequest: {
            clinicId: "uuid-da-clinica",
            employeeId: "uuid-do-funcionario (opcional)"
        },
        FinancialGetRequest: {
            id: "uuid-da-transacao",
            clinicId: "uuid-da-clinica"
        },
        FinancialCreateRequest: {
            schedulingId: "uuid-do-agendamento",
            category: "Receita",
            description: "Pagamento de Banho e Tosa",
            amount: 150.00,
            paymentDate: "2026-03-31",
            paymentMethod: "Cartão de Crédito",
            clinicId: "uuid-da-clinica"
        },
        FinancialUpdateRequest: {
            id: "uuid-da-transacao",
            clinicId: "uuid-da-clinica",
            category: "Despesa",
            description: "Manutenção de Equipamento",
            amount: 300.00,
            paymentDate: "2026-04-05",
            paymentMethod: "Pix"
        },
        FinancialResponse: {
            id: "uuid-da-transacao",
            schedulingId: "uuid-do-agendamento",
            category: "Receita",
            description: "Pagamento de Banho e Tosa",
            amount: 150.0,
            paymentDate: "2026-03-31",
            paymentMethod: "Cartão de Crédito",
            employeeId: "uuid-do-funcionario",
            clinicId: "uuid-da-clinica",
            createdAt: "2026-03-31T20:00:00Z"
        }
    }
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes.ts", "./docs/swagger-metadata.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
