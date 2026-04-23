/**
 * Este arquivo serve apenas para documentação do Swagger.
 * Permite manter o código de produção limpo de comentários.
 */

import { Router } from "express";

const router = Router();

/* ==========================================================================
   AUTENTICAÇÃO (AUTH)
   ========================================================================== */

router.post("/auth/login", () => {
  /* #swagger.tags = ['Autenticação']
       #swagger.description = 'Realiza o login de um funcionário na plataforma.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Credenciais de acesso',
          required: true,
          schema: { $ref: '#/definitions/LoginRequest' }
       }
       #swagger.responses[200] = {
          description: 'Autenticado com sucesso',
          schema: { $ref: '#/definitions/AuthResponse' }
       }
       #swagger.responses[401] = { description: 'Credenciais inválidas' }
    */
});

router.post("/auth/register", () => {
  /* #swagger.tags = ['Autenticação']
       #swagger.description = 'Registra um novo funcionário vinculado a uma clínica.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados do novo funcionário',
          required: true,
          schema: { $ref: '#/definitions/RegisterRequest' }
       }
       #swagger.responses[201] = {
          description: 'Funcionário registrado com sucesso',
          schema: { $ref: '#/definitions/AuthResponse' }
       }
       #swagger.responses[400] = { description: 'Dados inválidos ou e-mail já em uso' }
    */
});

/* ==========================================================================
   FINANCEIRO (FINANCIAL)
   ========================================================================== */

router.get("/financial/all", () => {
  /* #swagger.tags = ['Financeiro']
       #swagger.description = 'Lista todas as transações financeiras filtradas por clínica e opcionalmente por funcionário.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Filtros de busca',
          required: true,
          schema: { $ref: '#/definitions/FinancialListRequest' }
       }
       #swagger.responses[200] = {
          description: 'Lista de transações recuperada com sucesso',
          schema: { type: 'array', items: { $ref: '#/definitions/FinancialResponse' } }
       }
    */
});

router.get("/financial/detail", () => {
  /* #swagger.tags = ['Financeiro']
       #swagger.description = 'Obtém os detalhes de uma transação financeira específica.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Identificadores da transação',
          required: true,
          schema: { $ref: '#/definitions/FinancialGetRequest' }
       }
       #swagger.responses[200] = {
          description: 'Detalhes da transação',
          schema: { $ref: '#/definitions/FinancialResponse' }
       }
       #swagger.responses[404] = { description: 'Transação não encontrada ou acesso não autorizado' }
    */
});

router.post("/financial/", () => {
  /* #swagger.tags = ['Financeiro']
       #swagger.description = 'Cria um novo registro de transação financeira.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados da nova transação',
          required: true,
          schema: { $ref: '#/definitions/FinancialCreateRequest' }
       }
       #swagger.responses[201] = {
          description: 'Transação criada com sucesso',
          schema: { $ref: '#/definitions/FinancialResponse' }
       }
    */
});

router.put("/financial/", () => {
  /* #swagger.tags = ['Financeiro']
       #swagger.description = 'Atualiza os dados de uma transação financeira existente.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados atualizados da transação',
          required: true,
          schema: { $ref: '#/definitions/FinancialUpdateRequest' }
       }
       #swagger.responses[200] = {
          description: 'Transação atualizada com sucesso',
          schema: { $ref: '#/definitions/FinancialResponse' }
       }
    */
});

router.delete("/financial/", () => {
  /* #swagger.tags = ['Financeiro']
       #swagger.description = 'Remove permanentemente uma transação financeira.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Identificadores para exclusão',
          required: true,
          schema: { $ref: '#/definitions/FinancialGetRequest' }
       }
       #swagger.responses[204] = { description: 'Excluido com sucesso sem conteudo' }
       #swagger.responses[400] = { description: 'Falha na exclusao ou acesso negado' }
    */
});

/* ==========================================================================
   AGENDAMENTOS (SCHEDULING)
   ========================================================================== */

router.get("/scheduling/", () => {
  /* #swagger.tags = ['Agendamentos']
       #swagger.description = 'Lista todos os agendamentos cadastrados.'
       #swagger.responses[200] = {
          description: 'Lista de agendamentos recuperada com sucesso',
          schema: { type: 'array', items: { $ref: '#/definitions/SchedulingResponse' } }
       }
       #swagger.responses[500] = { description: 'Erro interno do servidor' }
    */
});

router.get("/scheduling/{id}", () => {
  /* #swagger.tags = ['Agendamentos']
       #swagger.description = 'Busca um agendamento pelo identificador.'
       #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID do agendamento',
          required: true,
          type: 'string'
       }
       #swagger.responses[200] = {
          description: 'Agendamento encontrado com sucesso',
          schema: { $ref: '#/definitions/SchedulingResponse' }
       }
       #swagger.responses[400] = { description: 'Parâmetros inválidos' }
       #swagger.responses[404] = { description: 'Agendamento não encontrado' }
       #swagger.responses[500] = { description: 'Erro interno do servidor' }
    */
});

router.post("/scheduling/", () => {
  /* #swagger.tags = ['Agendamentos']
       #swagger.description = 'Cria um novo agendamento.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados do agendamento',
          required: true,
          schema: { $ref: '#/definitions/SchedulingCreateRequest' }
       }
       #swagger.responses[201] = {
          description: 'Agendamento criado com sucesso',
          schema: { $ref: '#/definitions/SchedulingResponse' }
       }
       #swagger.responses[400] = { description: 'Dados inválidos para criação' }
       #swagger.responses[500] = { description: 'Erro interno do servidor' }
    */
});

router.put("/scheduling/{id}", () => {
  /* #swagger.tags = ['Agendamentos']
       #swagger.description = 'Atualiza um agendamento existente.'
       #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID do agendamento',
          required: true,
          type: 'string'
       }
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados atualizados do agendamento',
          required: true,
          schema: { $ref: '#/definitions/SchedulingUpdateRequest' }
       }
       #swagger.responses[200] = {
          description: 'Agendamento atualizado com sucesso',
          schema: { $ref: '#/definitions/SchedulingResponse' }
       }
       #swagger.responses[400] = { description: 'Dados inválidos para atualização' }
       #swagger.responses[404] = { description: 'Agendamento não encontrado' }
       #swagger.responses[500] = { description: 'Erro interno do servidor' }
    */
});

router.delete("/scheduling/{id}", () => {
  /* #swagger.tags = ['Agendamentos']
       #swagger.description = 'Remove um agendamento existente.'
       #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID do agendamento',
          required: true,
          type: 'string'
       }
       #swagger.responses[204] = { description: 'Agendamento removido com sucesso' }
       #swagger.responses[400] = { description: 'Parâmetros inválidos' }
       #swagger.responses[404] = { description: 'Agendamento não encontrado' }
       #swagger.responses[500] = { description: 'Erro interno do servidor' }
    */
});

/* ==========================================================================
   SERVIÇOS (SERVICE)
   ========================================================================== */

router.get("/service/", () => {
  /* #swagger.tags = ['Serviços']
       #swagger.description = 'Lista todos os serviços disponíveis.'
       #swagger.responses[200] = {
          description: 'Lista de serviços recuperada com sucesso',
          schema: { type: 'array', items: { $ref: '#/definitions/ServiceResponse' } }
       }
    */
});

router.get("/service/:id", () => {
  /* #swagger.tags = ['Serviços']
       #swagger.description = 'Busca um serviço pelo ID.'
       #swagger.responses[200] = {
          description: 'Serviço encontrado',
          schema: { $ref: '#/definitions/ServiceResponse' }
       }
       #swagger.responses[404] = { description: 'Serviço não encontrado' }
    */
});

router.post("/service/", () => {
  /* #swagger.tags = ['Serviços']
       #swagger.description = 'Cria um novo serviço.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados do novo serviço',
          required: true,
          schema: { $ref: '#/definitions/ServiceCreateRequest' }
       }
       #swagger.responses[201] = {
          description: 'Serviço criado com sucesso',
          schema: { $ref: '#/definitions/ServiceResponse' }
       }
       #swagger.responses[400] = { description: 'Dados inválidos' }
    */
});

router.put("/service/:id", () => {
  /* #swagger.tags = ['Serviços']
       #swagger.description = 'Atualiza os dados de um serviço existente.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados atualizados do serviço',
          required: true,
          schema: { $ref: '#/definitions/ServiceUpdateRequest' }
       }
       #swagger.responses[200] = {
          description: 'Serviço atualizado com sucesso',
          schema: { $ref: '#/definitions/ServiceResponse' }
       }
       #swagger.responses[404] = { description: 'Serviço não encontrado' }
    */
});

router.delete("/service/:id", () => {
  /* #swagger.tags = ['Serviços']
       #swagger.description = 'Remove permanentemente um serviço.'
       #swagger.responses[204] = { description: 'Serviço excluído com sucesso' }
       #swagger.responses[404] = { description: 'Serviço não encontrado' }
    */
});

/* ==========================================================================
   CLÍNICA (CLINIC)
   ========================================================================== */

router.get("/clinic/", () => {
  /* #swagger.tags = ['Clínica']
       #swagger.description = 'Lista todas as clínicas cadastradas.'
       #swagger.responses[200] = {
          description: 'Lista de clínicas recuperada com sucesso',
          schema: { type: 'array', items: { $ref: '#/definitions/ClinicResponse' } }
       }
    */
});

router.get("/clinic/:id", () => {
  /* #swagger.tags = ['Clínica']
       #swagger.description = 'Busca uma clínica pelo ID.'
       #swagger.responses[200] = {
          description: 'Clínica encontrada',
          schema: { $ref: '#/definitions/ClinicResponse' }
       }
       #swagger.responses[404] = { description: 'Clínica não encontrada' }
    */
});

router.post("/clinic/", () => {
  /* #swagger.tags = ['Clínica']
       #swagger.description = 'Cria uma nova clínica.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados da nova clínica',
          required: true,
          schema: { $ref: '#/definitions/ClinicCreateRequest' }
       }
       #swagger.responses[201] = {
          description: 'Clínica criada com sucesso',
          schema: { $ref: '#/definitions/ClinicResponse' }
       }
    */
});

router.put("/clinic/:id", () => {
  /* #swagger.tags = ['Clínica']
       #swagger.description = 'Atualiza os dados de uma clínica existente.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados atualizados da clínica',
          required: true,
          schema: { $ref: '#/definitions/ClinicCreateRequest' }
       }
       #swagger.responses[200] = {
          description: 'Clínica atualizada com sucesso',
          schema: { $ref: '#/definitions/ClinicResponse' }
       }
    */
});

router.delete("/clinic/:id", () => {
  /* #swagger.tags = ['Clínica']
       #swagger.description = 'Remove permanentemente uma clínica.'
       #swagger.responses[204] = { description: 'Clínica excluída com sucesso' }
    */
});

/* ==========================================================================
   FUNCIONÁRIO (EMPLOYEE)
   ========================================================================== */

router.get("/employee/", () => {
  /* #swagger.tags = ['Funcionário']
       #swagger.description = 'Lista todos os funcionários cadastrados.'
       #swagger.responses[200] = {
          description: 'Lista de funcionários recuperada com sucesso',
          schema: { type: 'array', items: { $ref: '#/definitions/EmployeeResponse' } }
       }
    */
});

router.get("/employee/:id", () => {
  /* #swagger.tags = ['Funcionário']
       #swagger.description = 'Busca um funcionário pelo ID.'
       #swagger.responses[200] = {
          description: 'Funcionário encontrado',
          schema: { $ref: '#/definitions/EmployeeResponse' }
       }
       #swagger.responses[404] = { description: 'Funcionário não encontrado' }
    */
});

router.post("/employee/", () => {
  /* #swagger.tags = ['Funcionário']
       #swagger.description = 'Cria um novo funcionário.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados do novo funcionário',
          required: true,
          schema: { $ref: '#/definitions/EmployeeCreateRequest' }
       }
       #swagger.responses[201] = {
          description: 'Funcionário criado com sucesso',
          schema: { $ref: '#/definitions/EmployeeResponse' }
       }
    */
});

router.put("/employee/:id", () => {
  /* #swagger.tags = ['Funcionário']
       #swagger.description = 'Atualiza os dados de um funcionário existente.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados atualizados do funcionário',
          required: true,
          schema: { $ref: '#/definitions/EmployeeCreateRequest' }
       }
       #swagger.responses[200] = {
          description: 'Funcionário atualizado com sucesso',
          schema: { $ref: '#/definitions/EmployeeResponse' }
       }
    */
});

router.delete("/employee/:id", () => {
  /* #swagger.tags = ['Funcionário']
       #swagger.description = 'Remove permanentemente um funcionário.'
       #swagger.responses[204] = { description: 'Funcionário excluído com sucesso' }
    */
});

/* ==========================================================================
   PET
   ========================================================================== */

router.get("/pet/", () => {
  /* #swagger.tags = ['Pet']
       #swagger.description = 'Lista todos os pets cadastrados.'
       #swagger.responses[200] = {
          description: 'Lista de pets recuperada com sucesso',
          schema: { type: 'array', items: { $ref: '#/definitions/PetResponse' } }
       }
    */
});

router.get("/pet/:id", () => {
  /* #swagger.tags = ['Pet']
       #swagger.description = 'Busca um pet pelo ID.'
       #swagger.responses[200] = {
          description: 'Pet encontrado',
          schema: { $ref: '#/definitions/PetResponse' }
       }
       #swagger.responses[404] = { description: 'Pet não encontrado' }
    */
});

router.post("/pet/", () => {
  /* #swagger.tags = ['Pet']
       #swagger.description = 'Cria um novo pet.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados do novo pet',
          required: true,
          schema: { $ref: '#/definitions/PetCreateRequest' }
       }
       #swagger.responses[201] = {
          description: 'Pet criado com sucesso',
          schema: { $ref: '#/definitions/PetResponse' }
       }
    */
});

router.put("/pet/:id", () => {
  /* #swagger.tags = ['Pet']
       #swagger.description = 'Atualiza os dados de um pet existente.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados atualizados do pet',
          required: true,
          schema: { $ref: '#/definitions/PetCreateRequest' }
       }
       #swagger.responses[200] = {
          description: 'Pet atualizado com sucesso',
          schema: { $ref: '#/definitions/PetResponse' }
       }
    */
});

router.delete("/pet/:id", () => {
  /* #swagger.tags = ['Pet']
       #swagger.description = 'Remove permanentemente um pet.'
       #swagger.responses[204] = { description: 'Pet excluído com sucesso' }
    */
});

/* ==========================================================================
   TUTOR
   ========================================================================== */

router.get("/tutor/", () => {
  /* #swagger.tags = ['Tutor']
       #swagger.description = 'Lista todos os tutores cadastrados.'
       #swagger.responses[200] = {
          description: 'Lista de tutores recuperada com sucesso',
          schema: { type: 'array', items: { $ref: '#/definitions/TutorResponse' } }
       }
    */
});

router.get("/tutor/:id", () => {
  /* #swagger.tags = ['Tutor']
       #swagger.description = 'Busca um tutor pelo ID.'
       #swagger.responses[200] = {
          description: 'Tutor encontrado',
          schema: { $ref: '#/definitions/TutorResponse' }
       }
       #swagger.responses[404] = { description: 'Tutor não encontrado' }
    */
});

router.post("/tutor/", () => {
  /* #swagger.tags = ['Tutor']
       #swagger.description = 'Cria um novo tutor.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados do novo tutor',
          required: true,
          schema: { $ref: '#/definitions/TutorCreateRequest' }
       }
       #swagger.responses[201] = {
          description: 'Tutor criado com sucesso',
          schema: { $ref: '#/definitions/TutorResponse' }
       }
    */
});

router.put("/tutor/:id", () => {
  /* #swagger.tags = ['Tutor']
       #swagger.description = 'Atualiza os dados de um tutor existente.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados atualizados do tutor',
          required: true,
          schema: { $ref: '#/definitions/TutorCreateRequest' }
       }
       #swagger.responses[200] = {
          description: 'Tutor atualizado com sucesso',
          schema: { $ref: '#/definitions/TutorResponse' }
       }
    */
});

router.delete("/tutor/:id", () => {
  /* #swagger.tags = ['Tutor']
       #swagger.description = 'Remove permanentemente um tutor.'
       #swagger.responses[204] = { description: 'Tutor excluído com sucesso' }
    */
});

/* ==========================================================================
   VACINA (VACCINE)
   ========================================================================== */

router.get("/vaccine/", () => {
  /* #swagger.tags = ['Vacina']
       #swagger.description = 'Lista todas as vacinas cadastradas.'
       #swagger.responses[200] = {
          description: 'Lista de vacinas recuperada com sucesso',
          schema: { type: 'array', items: { $ref: '#/definitions/VaccineResponse' } }
       }
    */
});

router.get("/vaccine/:id", () => {
  /* #swagger.tags = ['Vacina']
       #swagger.description = 'Busca uma vacina pelo ID.'
       #swagger.responses[200] = {
          description: 'Vacina encontrada',
          schema: { $ref: '#/definitions/VaccineResponse' }
       }
       #swagger.responses[404] = { description: 'Vacina não encontrada' }
    */
});

router.post("/vaccine/", () => {
  /* #swagger.tags = ['Vacina']
       #swagger.description = 'Cria uma nova vacina.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados da nova vacina',
          required: true,
          schema: { $ref: '#/definitions/VaccineCreateRequest' }
       }
       #swagger.responses[201] = {
          description: 'Vacina criada com sucesso',
          schema: { $ref: '#/definitions/VaccineResponse' }
       }
    */
});

router.put("/vaccine/:id", () => {
  /* #swagger.tags = ['Vacina']
       #swagger.description = 'Atualiza os dados de uma vacina existente.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados atualizados da vacina',
          required: true,
          schema: { $ref: '#/definitions/VaccineCreateRequest' }
       }
       #swagger.responses[200] = {
          description: 'Vacina atualizada com sucesso',
          schema: { $ref: '#/definitions/VaccineResponse' }
       }
    */
});

router.delete("/vaccine/:id", () => {
  /* #swagger.tags = ['Vacina']
       #swagger.description = 'Remove permanentemente uma vacina.'
       #swagger.responses[204] = { description: 'Vacina excluída com sucesso' }
    */
});

/* ==========================================================================
   PRODUTO (PRODUCT)
   ========================================================================== */

router.get("/product/", () => {
  /* #swagger.tags = ['Produto']
       #swagger.description = 'Lista todos os produtos cadastrados.'
       #swagger.responses[200] = {
          description: 'Lista de produtos recuperada com sucesso',
          schema: { type: 'array', items: { $ref: '#/definitions/ProductResponse' } }
       }
    */
});

router.get("/product/:id", () => {
  /* #swagger.tags = ['Produto']
       #swagger.description = 'Busca um produto pelo ID.'
       #swagger.responses[200] = {
          description: 'Produto encontrado',
          schema: { $ref: '#/definitions/ProductResponse' }
       }
       #swagger.responses[404] = { description: 'Produto não encontrado' }
    */
});

router.post("/product/", () => {
  /* #swagger.tags = ['Produto']
       #swagger.description = 'Cria um novo produto.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados do novo produto',
          required: true,
          schema: { $ref: '#/definitions/ProductCreateRequest' }
       }
       #swagger.responses[201] = {
          description: 'Produto criado com sucesso',
          schema: { $ref: '#/definitions/ProductResponse' }
       }
    */
});

router.put("/product/:id", () => {
  /* #swagger.tags = ['Produto']
       #swagger.description = 'Atualiza os dados de um produto existente.'
       #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados atualizados do produto',
          required: true,
          schema: { $ref: '#/definitions/ProductCreateRequest' }
       }
       #swagger.responses[200] = {
          description: 'Produto atualizado com sucesso',
          schema: { $ref: '#/definitions/ProductResponse' }
       }
    */
});

router.delete("/product/:id", () => {
  /* #swagger.tags = ['Produto']
       #swagger.description = 'Remove permanentemente um produto.'
       #swagger.responses[204] = { description: 'Produto excluído com sucesso' }
    */
});

export default router;
