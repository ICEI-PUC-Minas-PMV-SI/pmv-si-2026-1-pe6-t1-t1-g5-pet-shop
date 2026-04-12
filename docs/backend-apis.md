# APIs e Web Services

O Pet Flow é uma solução voltada para gestão de pet shops, criada para facilitar a organização das rotinas operacionais e melhorar a qualidade do atendimento ao cliente. A plataforma permite centralizar informações importantes do dia a dia do estabelecimento, como agendamentos de serviços, cadastro de clientes e registro dos pets, além do controle de estoque e da parte financeira, tornando esses processos mais práticos.

O sistema é estruturado em uma arquitetura distribuída, na qual diferentes partes funcionam de forma independente, mas conectadas. A integração entre a interface e o banco de dados ocorre por meio de uma API, que permite o envio e a atualização das informações em tempo real, garantindo acesso seguro e centralizado.

## Objetivos da API

A API é o núcleo do sistema, responsável por conectar as interfaces web e mobile ao banco de dados, garantindo que as informações sejam acessadas de forma segura, organizada e consistente. Sua estrutura em camadas facilita a manutenção e evolução da aplicação, centralizando toda a lógica de negócio em um único ponto.

- **Autenticação de usuários:** acesso seguro ao sistema por meio de JWT, com controle de permissões por perfil  
- **Gestão de usuários:** cadastro, login e manutenção de dados, com validações para garantir integridade das informações  
- **Gestão de pets:** cadastro, atualização e consulta de dados dos animais, permitindo o acompanhamento das informações  
- **Controle de serviços:** cadastro, edição e consulta dos serviços oferecidos pelo estabelecimento  
- **Gestão de agendamentos:** criação, atualização e cancelamento de atendimentos, com validação para evitar conflitos de horário  
- **Gestão financeira:** registro e controle de receitas e despesas do pet shop  
- **Gestão de estoque:** acompanhamento e controle de produtos disponíveis  

## Modelagem da Aplicação

### Diagrama de Entidade Relacionamento (DER)
![DER](../docs/img/diagram-der.png)

## Tecnologias Utilizadas

As principais tecnologias utilizadas no desenvolvimento da API são:

### Backend
- Node.js  
- Express.js  
- TypeScript  
- JWT (JSON Web Token para autenticação)  
- Zod (validação de dados)  
- Swagger / OpenAPI (documentação da API)  
- bcrypt (hash de senhas)  
- AES-256-CBC (criptografia de dados sensíveis)  

### Banco de Dados
- PostgreSQL (via Supabase)  

### Ferramentas de Desenvolvimento
- ESLint (padronização de código)  
- Prettier (formatação de código)  

## API Endpoints

A documentação completa e interativa dos endpoints da API está disponível no Swagger UI em http://localhost:3000/api-docs (ou na URL de produção). Nela é possível testar todas as rotas diretamente na interface, visualizar os esquemas de request/response e entender os parâmetros obrigatórios.

Abaixo, uma visão de alguns dos principais endpoints. Todos os endpoints (exceto autenticação) requerem um token JWT no header, obtido via login.

### Autenticação (`/auth`)

#### `POST /api/v1/auth/register` — Criar Usuário

- Descrição: cria um novo usuário no sistema.
  
**Body (JSON):**

```json
{
  "clinicId": "uuid-da-clinica",
  "name": "nome-usuario",
  "email": "email@exemplo.com",
  "password": "senha-segura",
  "role": "cargo-usuario",
  "phone": "telefone-usuario"
}
```

**Respostas:**

`201 Created` — Usuário criado com sucesso

```json
{
  "user_id": "uuid-do-usuario",
  "token": "token-do-usuario"
}
```

`400 Bad Request` —  Dados inválidos ou falha no cadastro

```json
{
  "error": "Dados inválidos ou usuário não cadastrado"
}
```

### Serviço (`/service`)

#### `GET /api/v1/service/:id ` —  Buscar serviço por ID

- Descrição: retorna os dados de um serviço específico pelo seu ID.
- Parâmetros: (UUID) na URL.

**Respostas:**

`201 OK` — Usuário criado com sucesso

```json
{
  "id": "uuid-do-servico",
  "name": "nome-servico",
  "description": "descricao-servico",
  "price": preco-servico,
  "duration": duracao-servico
}
```

`404 Not Found` —  Serviço não encontrado

```json
{
  "error": "Serviço não encontrado"
}
```

## Considerações de Segurança

A API adota práticas de segurança para proteger os dados e garantir o controle de acesso, incluindo autenticação via JWT, uso de middlewares para validação de tokens e tratamento de erros.

As senhas são armazenadas com hash utilizando bcrypt, enquanto dados sensíveis são protegidos com criptografia AES-256-CBC. Além disso, a validação de entradas ajuda a evitar inconsistências e acessos indevidos, garantindo maior segurança nas operações do sistema.

## Implantação

### 1. Requisitos de hardware e software

- **Node.js** (versão 18 ou superior)  
  Verificar com: `node -v`

- **npm** (versão 9 ou superior)  
  Verificar com: `npm -v`

- **Git** (qualquer versão)  
  Verificar com: `git --version`

- **VS Code** (qualquer versão)

- **Conta no Supabase** (para banco de dados PostgreSQL)

### 2. Plataforma de hospedagem

A aplicação utiliza o **Supabase** como banco de dados PostgreSQL na nuvem, responsável pelo armazenamento, gerenciamento e acesso aos dados da aplicação.

### 3. Instalação de dependências

Navegue até a pasta do backend e instale as dependências:

```bash
cd src/pet_flow_backend
npm install
```

### 4. Configuração de variáveis de ambiente

Crie um arquivo .env na pasta src/pet_flow_backend com as seguintes variáveis:

```bash
SUPABASE_URL=sua_url
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_PUBLISHABLE_KEY=sua_chave_publishable
ENCRYPTION_KEY=chave_de_32_caracteres
ENCRYPTION_IV=chave_de_16_caracteres
```

### 5. Iniciando o servidor

```bash
npm run dev
```

Saída esperada:

- O comando executa a geração da documentação Swagger: "Swagger-autogen: Success".
- Em seguida, inicia o ts-node-dev com informações sobre as versões instaladas.
- Carrega as variáveis de ambiente do arquivo .env: "◇ injected env (...) from .env".
- Finalmente, as mensagens de inicialização do servidor:

```bash
"[server]: Server is running at http://localhost:3000"
"[swagger]: API Documentation available at http://localhost:3000/api-docs"
```

> - O servidor ficará rodando em modo de desenvolvimento; pressione Ctrl+C para parar.
> - O ESLint será executado após interromper o servidor, corrigindo automaticamente problemas de linting detectados.

### 6.Autenticação

Todas as rotas da API (exceto /auth/login e /auth/register) exigem autenticação via token JWT. Para obter o token:

- Crie um usuário via POST /api/v1/auth/register com email e senha.
- Faça login via POST /api/v1/auth/login com as mesmas credenciais.
- Copie o token retornado.
- Adicione o token no header de todas as requisições:
  
```bash
Authorization: Bearer SEU_TOKEN
```

## Testes

Demonstração do teste do módulo de Serviço realiza no Postman, validando o funcionamento das rotas e o retorno correto das requisições.

![Teste service](../docs/img/teste-service.gif)

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.
