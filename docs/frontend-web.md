# Front-end Web

O PetFlow é uma aplicação web para gestão de pet shops, permitindo o gerenciamento de agendamentos, financeiro, funcionários, pets, tutores, serviços e produtos. A interface foi desenvolvida com foco em usabilidade, responsividade e uma experiência fluida para administradores e funcionários da clínica.

## Projeto da Interface Web

A interface web do PetFlow segue um layout de painel administrativo com sidebar fixa à esquerda para navegação e área de conteúdo principal à direita. O design prioriza clareza visual, cards informativos e tabelas para exibição de dados.

O protótipo completo da interface está disponível no Figma:

🔗 **[Protótipo no Figma](https://www.figma.com/design/FEP3bCIGSpLnXUlkcwwtdd/workflow?node-id=0-1&t=OtzPpHNFHqzNRYBo-1)**

### Wireframes

As principais telas da aplicação incluem:

- *Login* — Tela de autenticação com validação de domínio corporativo (@petflow.com.br)
- *Dashboard* — Visão geral com métricas e resumo da clínica
- *Agendamentos* — Listagem e gerenciamento de agendamentos de serviços
- *Financeiro* — Cards de resumo (receita, despesas, saldo), gráfico de barras dos últimos 6 meses e tabela de transações recentes
- *Funcionários* — Cadastro e gerenciamento de funcionários
- *Pets / Tutores* — Cadastro de pets e seus responsáveis
- *Serviços / Produtos* — Catálogo de serviços e produtos oferecidos

### Design Visual

O projeto utiliza CSS Custom Properties definidas em src/styles/variables.css:

| Variável | Valor | Descrição |
|---|---|---|
| --color-primary | #197BE9 | Cor primária (botões, links, destaques) |
| --color-primary-dark | #1D2845 | Cor primária escura (hover, textos fortes) |
| --color-primary-light | #4799EB | Cor primária clara (fundo do login) |
| --color-primary-bg | #DBEBF9 | Fundo com tom primário suave |
| --color-bg-main | #E4E7E9 | Fundo principal da aplicação |
| --color-bg-sidebar | #F6F8FA | Fundo da sidebar e hover de linhas |
| --color-bg-card | #F6F8FA | Fundo dos cards |
| --color-bg-white | #FFFFFF | Fundo branco (modais, painéis) |
| --color-bg-table-header | rgba(240,240,240,0.71) | Fundo do cabeçalho de tabelas |
| --color-bg-button-icon | #F5F5F5 | Fundo de botões de ícone |
| --color-text-primary | #141313 | Texto principal |
| --color-text-secondary | #151515 | Texto secundário |
| --color-text-placeholder | rgba(20,19,19,0.57) | Texto de placeholder |
| --color-text-white | #FFFFFF | Texto branco |
| --color-text-muted | rgba(21,21,21,0.75) | Texto suavizado |
| --color-success | #7DC767 | Cor de sucesso (receitas, positivo) |
| --color-danger | #DE6767 | Cor de perigo (despesas, erros) |
| --color-danger-bg | #F5E0E0 | Fundo de alerta de perigo |
| --color-border | #D9D9D9 | Cor de bordas |
| --color-border-active | #4799EB | Borda de input ativo/focado |
| --shadow-card | 0px 2px 4px rgba(0,0,0,0.25) | Sombra de cards |
| --shadow-sidebar-item | 0px 2px 2px rgba(0,0,0,0.25) | Sombra de item da sidebar |
| --shadow-input | 0px 4px 4px rgba(0,0,0,0.25) | Sombra de inputs |
| --font-family | 'Poppins', sans-serif | Fonte principal |
| --font-size-xs | 12px | Tamanho extra pequeno |
| --font-size-sm | 13px | Tamanho pequeno |
| --font-size-base | 14px | Tamanho base |
| --font-size-md | 15px | Tamanho médio |
| --font-size-lg | 17px | Tamanho grande |
| --font-size-xl | 20px | Tamanho extra grande |
| --font-size-2xl | 22px | Tamanho 2x grande |
| --font-size-3xl | 32px | Tamanho 3x grande |
| --font-weight-regular | 400 | Peso regular |
| --font-weight-medium | 500 | Peso médio |
| --font-weight-semibold | 600 | Peso semi-negrito |
| --font-weight-bold | 700 | Peso negrito |
| --spacing-xs | 4px | Espaçamento extra pequeno |
| --spacing-sm | 8px | Espaçamento pequeno |
| --spacing-md | 12px | Espaçamento médio |
| --spacing-lg | 16px | Espaçamento grande |
| --spacing-xl | 20px | Espaçamento extra grande |
| --spacing-2xl | 24px | Espaçamento 2x grande |
| --spacing-3xl | 32px | Espaçamento 3x grande |
| --radius-sm | 5px | Borda arredondada pequena |
| --radius-md | 6px | Borda arredondada média |
| --radius-lg | 10px | Borda arredondada grande |
| --radius-xl | 11px | Borda arredondada extra grande |
| --radius-round | 50% | Totalmente circular |
| --sidebar-width | 180px | Largura da sidebar |
| --transition-fast | 0.15s ease | Transição rápida |
| --transition-normal | 0.25s ease | Transição normal |

## Fluxo de Dados

![DER](../docs/img/petflow_arquitetura.png)

### Fluxo de Autenticação

1. O usuário informa e-mail (@petflow.com.br) e senha na tela de login
2. O frontend envia POST /api/v1/auth/login com as credenciais
3. O backend retorna token (JWT), refresh_token e user_id
4. O frontend armazena esses dados em localStorage (se "Lembrar de mim") ou sessionStorage
5. O SessionContext é inicializado e busca os dados do funcionário via GET /api/v1/employees/:userId
6. Os dados da sessão (userId, clinicId, name, role) são cacheados no storage e disponibilizados via Context API para todos os componentes
7. Todas as requisições subsequentes incluem o header Authorization: Bearer <token>
8. A sessão expira após 1 hora; se houver refresh_token, o sistema tenta renovar automaticamente

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 19.2.5 | Biblioteca de UI (componentes) |
| TypeScript | 6.0.2 | Tipagem estática |
| Vite | 8.0.10 | Build tool e dev server |
| React Router DOM | 6.28.0 | Roteamento SPA |
| React Icons | 5.3.0 | Ícones (Material Design) |
| CSS Modules | — | Estilização com escopo local |
| ESLint | 10.2.1 | Linting e qualidade de código |

## Considerações de Segurança

- *Autenticação:* Login via JWT (JSON Web Token) com validação de domínio corporativo (@petflow.com.br) no frontend
- *Autorização:* Rotas protegidas com componente RequireAuth que verifica a existência de token válido antes de renderizar páginas autenticadas
- *Armazenamento de token:* Uso de localStorage (com opção "Lembrar de mim") ou sessionStorage para persistência do token
- *Comunicação segura:* Todas as requisições à API utilizam HTTPS
- *Validação de entrada:* Inputs validados no frontend (formato de e-mail, campos obrigatórios) e no backend
- *Proteção contra XSS:* React escapa automaticamente conteúdo renderizado; não há uso de dangerouslySetInnerHTML
- *CORS:* Backend configurado para aceitar requisições apenas de origens autorizadas

## Implantação

A aplicação frontend é implantada como um site estático (SPA):

1. *Requisitos:*
   - Node.js 18+ e npm/yarn

2. *Plataforma de hospedagem:*
   - Frontend: Vercel
   - Backend: Render (https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com)

3. *Configuração do ambiente:*
   - A URL da API já está configurada como fallback no código (https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com/api/v1), dispensando variáveis de ambiente em produção

   - Configurar redirects para SPA (todas as rotas apontam para index.html)

4. *Deploy:*
   bash
   npm install
   npm run build
   
   O diretório dist/ gerado contém os arquivos estáticos prontos para servir.

5. *Verificação:*
   - Testar login com credenciais válidas
   - Verificar se todas as rotas carregam corretamente
   - Confirmar comunicação com a API (CORS, token)
   - Testar responsividade em diferentes dispositivos
     
## Testes

Os testes abaixo cobrem os recursos principais da aplicação web: clínicas, tutores, pets, agendamentos, serviços, produtos/estoque, funcionários e financeiro. Além disso as imagens que comprovam os testes se encontram no caminho (pmv-si-2026-1-pe6-t1-t1-g5-pet-shop\docs\img\Evidências_Web).  


### Ferramentas

| Tipo | Ferramenta | Uso |
|---|---|---|
| Unitário/Integração | Vitest + React Testing Library | Testar componentes, hooks e validações |
| Mock de API | MSW | Simular sucesso e erro da API |
| E2E | Playwright | Validar fluxo completo no navegador |

### Casos de Teste Funcionais

| ID | Tipo | Cenário | Resultado esperado |
|---|---|---|---|
| CT-B-01 | Integração | Cadastrar clínica com dados válidos | Clínica é salva e aparece na listagem |
| CT-B-02 | Integração | Editar dados da clínica | Dados atualizados corretamente na tela |
| CT-B-03 | Integração | Cadastrar tutor (dono de pet) | Tutor aparece na listagem |
| CT-B-04 | Integração | Editar tutor | Dados alterados e persistidos |
| CT-B-05 | Integração | Cadastrar pet vinculado a tutor | Pet é salvo com vínculo correto ao tutor |
| CT-B-06 | Integração | Editar pet | Dados do pet atualizados |
| CT-B-07 | E2E | Criar agendamento para pet existente | Agendamento aparece na listagem |
| CT-B-08 | E2E | Editar agendamento | Agendamento atualizado corretamente |
| CT-B-09 | E2E | Cancelar agendamento | Status alterado para cancelado |
| CT-B-10 | Integração | Cadastrar serviço com valor e duração | Serviço aparece na listagem com os dados corretos |
| CT-B-11 | Integração | Editar serviço | Serviço é atualizado sem perder dados obrigatórios |
| CT-B-12 | Integração | Cadastrar produto em estoque | Produto aparece com nome, preço e quantidade |
| CT-B-13 | Integração | Editar quantidade em estoque | Quantidade é atualizada corretamente |
| CT-B-14 | Integração | Excluir produto | Produto é removido da listagem após confirmação |
| CT-B-15 | Integração | Cadastrar funcionário | Funcionário aparece na listagem |
| CT-B-16 | Integração | Editar funcionário | Dados do funcionário atualizados corretamente |
| CT-B-17 | Integração | Registrar entrada/saída no financeiro | Valor é refletido no resumo financeiro |
| CT-B-18 | Integração | Demostrar o dashboard | Valor é refletido no dashboard |



### Registro de Execução em imagens 

| ID | Resultado | Evidência |
|---|---|---|
| CT-B-01 | Passou | ct-b-01-clinica-cadastro.png |
| CT-B-02 | Passou | ct-b-02-clinica-edicao.png |
| CT-B-03 | Passou | ct-b-03-tutor-cadastro.png |
| CT-B-04 | Passou | ct-b-04-tutor-edicao.png |
| CT-B-05 | Passou | ct-b-05-pet-cadastro.png |
| CT-B-06 | Passou | ct-b-06-pet-edicao.png |
| CT-B-07 | Passou | ct-b-07-agendamento-criar.png |
| CT-B-08 | Passou | ct-b-08-agendamento-editar.png |
| CT-B-09 | Passou | ct-b-09-agendamento-cancelar.png |
| CT-B-10 | Passou | ct-b-10-servico-cadastro.png |
| CT-B-11 | Passou | ct-b-11-servico-edicao.png |
| CT-B-12 | Passou | ct-b-12-produto-cadastro.png |
| CT-B-13 | Passou | ct-b-13-estoque-atualizacao.png |
| CT-B-14 | Passou | ct-b-14-produto-exclusao.png |
| CT-B-15 | Passou | ct-b-15-funcionario-cadastro.png |
| CT-B-16 | Passou | ct-b-16-funcionario-edicao.png |
| CT-B-17 | Passou | ct-b-17-financeiro-lancamento.png |
| CT-B-18 | Passou | ct-b-18-financeiro-dashboard.png |

### Registro de Execução em vídeo 

Demonstração prática da aplicação apresentando o funcionamento do sistema e a execução dos testes realizados durante o desenvolvimento:

🔗 **[Demonstração da Aplicação](https://vimeo.com/1191018985?share=copy&fl=sv&fe=ci)**

# Referências

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Figma - Protótipo PetFlow](https://www.figma.com/design/FEP3bCIGSpLnXUlkcwwtdd/workflow?node-id=0-1&t=OtzPpHNFHqzNRYBo-1)
