import swaggerAutogen from "swagger-autogen";
import { VERSION } from "./version";

const host =
  process.env.NODE_ENV === "production"
    ? "pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com"
    : "localhost:3000";

const doc = {
  host: host,
  schemes: process.env.NODE_ENV === "production" ? ["https"] : ["http"],
  basePath: `/api/v${VERSION.split(".")[0]}`,
  info: {
    title: "Pet Flow API",
    description:
      "Documentação oficial da API do sistema Pet Flow para gestão de pet shops. Inclui módulos de Autenticação, Gestão Financeira e Agendamentos.",
    version: VERSION,
  },
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Insira o token Bearer, ex: Bearer {token}",
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: "Autenticação",
      description: "Gestão de acesso e registro de funcionários",
    },
    {
      name: "Financeiro",
      description: "Controle de transações financeiras e fluxo de caixa",
    },
    {
      name: "Agendamentos",
      description: "Gestão de agendamentos de atendimento",
    },
    {
      name: "Serviços",
      description: "Cadastro e gestão de serviços oferecidos pelo pet shop",
    },
    {
      name: "Clínica",
      description: "Gestão de informações da clínica",
    },
    {
      name: "Funcionário",
      description: "Gestão de funcionários",
    },
    {
      name: "Pet",
      description: "Gestão de pets",
    },
    {
      name: "Tutor",
      description: "Gestão de tutores",
    },
    {
      name: "Vacina",
      description: "Gestão de vacinas",
    },
    {
      name: "Produto",
      description: "Gestão de produtos",
    },
  ],


  definitions: {
    LoginRequest: {
      email: "funcionario@exemplo.com",
      password: "minhasenha123",
    },
    RegisterRequest: {
      email: "novo@exemplo.com",
      password: "senha-segura",
    },
    AuthResponse: {
      user_id: "uuid-do-usuario",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
    FinancialListRequest: {
      clinic_id: "uuid-da-clinica",
      employee_id: "uuid-do-funcionario (opcional)",
    },
    FinancialGetRequest: {
      id: "uuid-da-transacao",
      clinic_id: "uuid-da-clinica",
    },
    FinancialCreateRequest: {
      idx: 0,
      scheduling_id: "uuid-do-agendamento",
      description: "Pagamento de Banho e Tosa",
      amount: 150.0,
      payment_method: "Cartão de Crédito",
      clinic_id: "uuid-da-clinica",
    },
    FinancialUpdateRequest: {
      id: "uuid-da-transacao",
      clinic_id: "uuid-da-clinica",
      idx: 0,
      description: "Manutenção de Equipamento",
      amount: 300.0,
      payment_method: "Pix",
    },
    FinancialResponse: {
      idx: 0,
      id: "uuid-da-transacao",
      scheduling_id: "uuid-do-agendamento",
      description: "Pagamento de Banho e Tosa",
      amount: 150.0,
      payment_method: "Cartão de Crédito",
      employee_id: "uuid-do-funcionario",
      clinic_id: "uuid-da-clinica",
      created_at: "2026-03-31T20:00:00Z",
    },
    SchedulingCreateRequest: {
      clinicId: "uuid-da-clinica",
      tutorId: "uuid-do-tutor",
      petId: "uuid-do-pet",
      employeeId: "uuid-do-funcionario",
      dateTime: "2026-04-10T14:00:00.000Z",
      status: "Agendado",
      totalValue: 120.0,
      notes: "Banho e tosa completa",
    },
    SchedulingUpdateRequest: {
      clinicId: "uuid-da-clinica",
      tutorId: "uuid-do-tutor",
      petId: "uuid-do-pet",
      employeeId: "uuid-do-funcionario",
      dateTime: "2026-04-11T10:30:00.000Z",
      status: "Confirmado",
      totalValue: 140.0,
      notes: "Confirmado por telefone",
    },
    SchedulingResponse: {
      id: "uuid-do-agendamento",
      clinicId: "uuid-da-clinica",
      tutorId: "uuid-do-tutor",
      petId: "uuid-do-pet",
      employeeId: "uuid-do-funcionario",
      dateTime: "2026-04-10T14:00:00.000Z",
      status: "Agendado",
      totalValue: 120.0,
      notes: "Banho e tosa completa",
      createdAt: "2026-04-01T12:00:00.000Z",
    },
    ServiceCreateRequest: {
      name: "Banho e tosa",
      description: "Banho e tosa em cachorro",
      price: 90.0,
      duration: 90,
    },
    ServiceUpdateRequest: {
      name: "Banho e tosa",
      description: "Banho e tosa completo",
      price: 100.0,
      duration: 90,
    },
    ServiceResponse: {
      id: "uuid-do-servico",
      name: "Banho e tosa",
      description: "Banho e tosa completo",
      price: 120.0,
      duration: 90,
    },
    ClinicCreateRequest: {
      name: "Pet Flow Clinic",
      cnpj: "12.345.678/0001-90",
      address: "Rua das Flores, 123",
      phone: "(11) 99999-9999",
      email: "contato@petflow.com",
    },
    ClinicResponse: {
      id: "uuid-da-clinica",
      name: "Pet Flow Clinic",
      cnpj: "12.345.678/0001-90",
      address: "Rua das Flores, 123",
      phone: "(11) 99999-9999",
      email: "contato@petflow.com",
      createdAt: "2026-04-13T12:00:00Z",
    },
    EmployeeCreateRequest: {
      name: "João Silva",
      cpf: "123.456.789-00",
      address: "Av. Paulista, 1000",
      phone: "(11) 88888-8888",
      email: "joao@exemplo.com",
      role: "Veterinário",
    },
    EmployeeResponse: {
      id: "uuid-do-funcionario",
      name: "João Silva",
      cpf: "123.456.789-00",
      address: "Av. Paulista, 1000",
      phone: "(11) 88888-8888",
      email: "joao@exemplo.com",
      role: "Veterinário",
      createdAt: "2026-04-13T12:00:00Z",
    },
    PetCreateRequest: {
      name: "Rex",
      species: "Cachorro",
      breed: "Labrador",
      age: 5,
      weight: 30.5,
      tutorId: "uuid-do-tutor",
    },
    PetResponse: {
      id: "uuid-do-pet",
      name: "Rex",
      species: "Cachorro",
      breed: "Labrador",
      age: 5,
      weight: 30.5,
      tutorId: "uuid-do-tutor",
      createdAt: "2026-04-13T12:00:00Z",
    },
    TutorCreateRequest: {
      name: "Maria Oliveira",
      cpf: "987.654.321-00",
      address: "Rua Aclimação, 50",
      phone: "(11) 77777-7777",
      email: "maria@exemplo.com",
    },
    TutorResponse: {
      id: "uuid-do-tutor",
      name: "Maria Oliveira",
      cpf: "987.654.321-00",
      address: "Rua Aclimação, 50",
      phone: "(11) 77777-7777",
      email: "maria@exemplo.com",
      createdAt: "2026-04-13T12:00:00Z",
    },
    VaccineCreateRequest: {
      name: "V10",
      description: "Vacina múltipla para cães",
      batch: "AB1234",
      expirationDate: "2027-01-01T00:00:00Z",
    },
    VaccineResponse: {
      id: "uuid-da-vacina",
      name: "V10",
      description: "Vacina múltipla para cães",
      batch: "AB1234",
      expirationDate: "2027-01-01T00:00:00Z",
      createdAt: "2026-04-13T12:00:00Z",
    },
    ProductCreateRequest: {
      name: "Ração Premium",
      description: "Ração para cães adultos de porte médio",
      price: 150.0,
      stock: 50,
      category: "Alimentação",
    },
    ProductResponse: {
      id: "uuid-do-produto",
      name: "Ração Premium",
      description: "Ração para cães adultos de porte médio",
      price: 150.0,
      stock: 50,
      category: "Alimentação",
      createdAt: "2026-04-13T12:00:00Z",
    },
  },


};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes.ts", "./docs/swagger-metadata.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
