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

router.post("/financial/all", () => {
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

router.post("/financial/detail", () => {
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

export default router;
