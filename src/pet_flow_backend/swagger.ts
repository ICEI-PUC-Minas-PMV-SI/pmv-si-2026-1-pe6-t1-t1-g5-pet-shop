import swaggerAutogen from "swagger-autogen";

const doc = {
    basePath: "/api/v1",
    info: {
        title: "Pet Flow API",
        description: "Documentação oficial da API do sistema Pet Flow para gestão de pet shops. Inclui módulos de Autenticação, Gestão Financeira e Agendamentos.",
        version: "1.2.0"
    },
    securityDefinitions: {
        bearerAuth: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description: "Insira o token Bearer, ex: Bearer {token}"
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ],
    tags: [
        { name: "Autenticação", description: "Gestão de acesso e registro de funcionários" },
        { name: "Financeiro", description: "Controle de transações financeiras e fluxo de caixa" },
        { name: "Agendamentos", description: "Gestão de agendamentos de atendimento" },
        { name: "Serviços", description: "Cadastro e gestão de serviços oferecidos pelo pet shop" }
    ],
    definitions: {
        LoginRequest: {
            email: "funcionario@exemplo.com",
            password: "minhasenha123"
        },
        RegisterRequest: {
            email: "novo@exemplo.com",
            password: "senha-segura"
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
        },
        SchedulingCreateRequest: {
            clinicId: "uuid-da-clinica",
            tutorId: "uuid-do-tutor",
            petId: "uuid-do-pet",
            employeeId: "uuid-do-funcionario",
            dateTime: "2026-04-10T14:00:00.000Z",
            status: "Agendado",
            totalValue: 120.00,
            notes: "Banho e tosa completa"
        },
        SchedulingUpdateRequest: {
            clinicId: "uuid-da-clinica",
            tutorId: "uuid-do-tutor",
            petId: "uuid-do-pet",
            employeeId: "uuid-do-funcionario",
            dateTime: "2026-04-11T10:30:00.000Z",
            status: "Confirmado",
            totalValue: 140.00,
            notes: "Confirmado por telefone"
        },
        SchedulingResponse: {
            id: "uuid-do-agendamento",
            clinicId: "uuid-da-clinica",
            tutorId: "uuid-do-tutor",
            petId: "uuid-do-pet",
            employeeId: "uuid-do-funcionario",
            dateTime: "2026-04-10T14:00:00.000Z",
            status: "Agendado",
            totalValue: 120.00,
            notes: "Banho e tosa completa",
            createdAt: "2026-04-01T12:00:00.000Z"
        },
        ServiceCreateRequest: {
            name: "Banho e tosa",
            description: "Banho e tosa em cachorro",
            price: 90.00,
            duration: 90
        },
        ServiceUpdateRequest: {
            name: "Banho e tosa",
            description: "Banho e tosa completo",
            price: 100.00,
            duration: 90
        },
        ServiceResponse: {
            id: "uuid-do-servico",
            name: "Banho e tosa",
            description: "Banho e tosa completo",
            price: 120.00,
            duration: 90
        }
    }
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes.ts", "./docs/swagger-metadata.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
