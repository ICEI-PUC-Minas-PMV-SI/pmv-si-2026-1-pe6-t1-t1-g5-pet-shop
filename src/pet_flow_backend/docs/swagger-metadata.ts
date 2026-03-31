/**
 * Metadata Documentation File (Purely for Swagger Autogen)
 * 
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

export default router;
