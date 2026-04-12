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

###  Clínicas

#### 1. Cadastro de Clínica
- **Método:** `POST`
- **URL:** `/api/clinics`
- **Parâmetros (Body JSON):**
  - `name`: Nome da clínica (String)
  - `cnpj`: CNPJ (String)
  - `email`: Email (String)
  - `phone`: Telefone (String)
  - `address`: Endereço (String)
  - `city`: Cidade (String)
  - `state`: Estado (String)
  - `zip_code`: CEP (String)
  - `is_active`: Status da clínica (Boolean: `true`/`false`)
- **Resposta:**
  - Sucesso (201 Created)
    ```json
    {
      "message": "Clínica cadastrada com sucesso",
      "data": {
        "id": 1,
        "name": "Pet Flow",
        "cnpj": "12345678000100",
        "email": "contato@petflow.com",
        "is_active": true
      }
    }
    ```
  - Erro (400 Bad Request / 500 Internal Server Error)
    ```json
    {
      "message": "Erro ao cadastrar clínica",
      "error": {
        "details": "Mensagem descritiva do erro (ex: CNPJ já cadastrado)"
      }
    }
    ```

#### 2. Atualização de Clínica
- **Método:** `PUT`
- **URL:** `/api/clinics/{id}`
- **Parâmetros:**
  - **Path:** `{id}` - ID da clínica a ser atualizada.
  - **Body JSON:** Apenas os campos que deseja atualizar (ex: `name`, `phone`, etc).
- **Resposta:**
  - Sucesso (200 OK)
    ```json
    {
      "message": "Clínica atualizada com sucesso",
      "data": {
        "id": 1,
        "name": "Pet Flow Atualizada"
      }
    }
    ```
  - Erro (404 Not Found / 400 Bad Request)
    ```json
    {
      "message": "Clínica não encontrada ou erro de validação",
      "error": { ... }
    }
    ```

#### 3. Exclusão de Clínica
- **Método:** `DELETE`
- **URL:** `/api/clinics/{id}`
- **Parâmetros:**
  - **Path:** `{id}` - ID da clínica a ser excluída.
- **Resposta:**
  - Sucesso (200 OK ou 204 No Content)
    ```json
    {
      "message": "Clínica excluída com sucesso"
    }
    ```
  - Erro (404 Not Found)
    ```json
    {
      "message": "Clínica não encontrada",
      "error": { ... }
    }
    ```

---

### Tutores

#### 1. Cadastro de Tutor
- **Método:** `POST`
- **URL:** `/api/tutors`
- **Parâmetros (Body JSON):**
  - `name`: Nome do tutor (String)
  - `email`: Email (String)
  - `phone`: Telefone (String)
- **Resposta:**
  - Sucesso (201 Created)
    ```json
    {
      "message": "Tutor cadastrado com sucesso",
      "data": {
        "id": 1,
        "name": "João Silva",
        "email": "joao@email.com",
        "phone": "31999999999"
      }
    }
    ```
  - Erro (400 Bad Request / 500 Internal Server Error)
    ```json
    {
      "message": "Erro ao cadastrar tutor",
      "error": { ... }
    }
    ```

#### 2. Atualização de Tutor
- **Método:** `PUT`
- **URL:** `/api/tutors/{id}`
- **Parâmetros:**
  - **Path:** `{id}` - ID do tutor a ser atualizado.
  - **Body JSON:** Apenas os campos que deseja atualizar (ex: `name`, `email`).
- **Resposta:**
  - Sucesso (200 OK)
    ```json
    {
      "message": "Tutor atualizado com sucesso",
      "data": {
        "id": 1,
        "name": "João Atualizado"
      }
    }
    ```
  - Erro (404 Not Found / 400 Bad Request)
    ```json
    {
      "message": "Tutor não encontrado ou erro de validação",
      "error": { ... }
    }
    ```

#### 3. Exclusão de Tutor
- **Método:** `DELETE`
- **URL:** `/api/tutors/{id}`
- **Parâmetros:**
  - **Path:** `{id}` - ID do tutor a ser excluído.
- **Resposta:**
  - Sucesso (200 OK ou 204 No Content)
    ```json
    {
      "message": "Tutor excluído com sucesso"
    }
    ```
  - Erro (404 Not Found)
    ```json
    {
      "message": "Tutor não encontrado",
      "error": { ... }
    }
    ```

    ###  Pets

#### 1. Cadastro de Pet
- **Método:** `POST`
- **URL:** `/api/pets`
- **Parâmetros (Body JSON):**
  - `name`: Nome do pet (String)
  - `species`: Espécie (String)
  - `breed`: Raça (String)
  - `birth_date`: Data de nascimento (String/Date: `YYYY-MM-DD`)
  - `size`: Porte (String)
  - `weight`: Peso (Number)
  - `color`: Cor (String)
  - `gender`: Sexo (String)
  - `tutor_id`: ID do tutor responsável (String/UUID)
- **Resposta:**
  - Sucesso (201 Created)
    ```json
    {
      "message": "Pet cadastrado com sucesso",
      "data": {
        "id": 1,
        "name": "Rex",
        "species": "cachorro",
        "breed": "vira-lata",
        "birth_date": "2020-01-01",
        "size": "medio",
        "weight": 10,
        "color": "marrom",
        "gender": "macho",
        "tutor_id": "ID_DO_TUTOR"
      }
    }
    ```
  - Erro (400 Bad Request / 500 Internal Server Error)
    ```json
    {
      "message": "Erro ao cadastrar pet",
      "error": { 
        "details": "Mensagem descritiva do erro (ex: Tutor não encontrado)" 
      }
    }
    ```

#### 2. Atualização de Pet
- **Método:** `PUT`
- **URL:** `/api/pets/{id}`
- **Parâmetros:**
  - **Path:** `{id}` - ID do pet a ser atualizado.
  - **Body JSON:** Apenas os campos que deseja atualizar (ex: `name`, `weight`, `size`).
- **Resposta:**
  - Sucesso (200 OK)
    ```json
    {
      "message": "Pet atualizado com sucesso",
      "data": {
        "id": 1,
        "name": "Rex Atualizado"
      }
    }
    ```
  - Erro (404 Not Found / 400 Bad Request)
    ```json
    {
      "message": "Pet não encontrado ou erro de validação",
      "error": { ... }
    }
    ```

#### 3. Exclusão de Pet
- **Método:** `DELETE`
- **URL:** `/api/pets/{id}`
- **Parâmetros:**
  - **Path:** `{id}` - ID do pet a ser excluído.
- **Resposta:**
  - Sucesso (200 OK ou 204 No Content)
    ```json
    {
      "message": "Pet excluído com sucesso"
    }
    ```
  - Erro (404 Not Found)
    ```json
    {
      "message": "Pet não encontrado",
      "error": { ... }
    }
    ```

    ###  Vacinas

#### 1. Cadastro de Vacina
- **Método:** `POST`
- **URL:** `/api/vaccines`
- **Parâmetros (Body JSON):**
  - `pet_id`: ID do pet (String/UUID)
  - `name`: Nome da vacina (String)
  - `date`: Data da aplicação (String/Date: `YYYY-MM-DD`)
- **Resposta:**
  - Sucesso (201 Created)
    ```json
    {
      "message": "Vacina cadastrada com sucesso",
      "data": {
        "id": 1,
        "pet_id": "ID_PET",
        "name": "V10",
        "date": "2026-01-01"
      }
    }
    ```
  - Erro (400 Bad Request / 500 Internal Server Error)
    ```json
    {
      "message": "Erro ao cadastrar vacina",
      "error": {
        "details": "Mensagem descritiva do erro (ex: Pet não encontrado)"
      }
    }
    ```

#### 2. Atualização de Vacina
- **Método:** `PUT`
- **URL:** `/api/vaccines/{id}`
- **Parâmetros:**
  - **Path:** `{id}` - ID da vacina a ser atualizada.
  - **Body JSON:** Apenas os campos que deseja atualizar (ex: `name`, `date`).
- **Resposta:**
  - Sucesso (200 OK)
    ```json
    {
      "message": "Vacina atualizada com sucesso",
      "data": {
        "id": 1,
        "name": "V10 Atualizada"
      }
    }
    ```
  - Erro (404 Not Found / 400 Bad Request)
    ```json
    {
      "message": "Vacina não encontrada ou erro de validação",
      "error": {
        "details": "..."
      }
    }
    ```

#### 3. Exclusão de Vacina
- **Método:** `DELETE`
- **URL:** `/api/vaccines/{id}`
- **Parâmetros:**
  - **Path:** `{id}` - ID da vacina a ser excluída.
- **Resposta:**
  - Sucesso (200 OK ou 204 No Content)
    ```json
    {
      "message": "Vacina excluída com sucesso"
    }
    ```
  - Erro (404 Not Found)
    ```json
    {
      "message": "Vacina não encontrada",
      "error": {
        "details": "..."
      }
    }
    ```


## Considerações de Segurança

A API adota práticas de segurança para proteger os dados e garantir o controle de acesso, incluindo autenticação via JWT, uso de middlewares para validação de tokens e tratamento de erros.

As senhas são armazenadas com hash utilizando bcrypt, enquanto dados sensíveis são protegidos com criptografia AES-256-CBC. Além disso, a validação de entradas ajuda a evitar inconsistências e acessos indevidos, garantindo maior segurança nas operações do sistema.
## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

## Cadastro, exclusão e atualização de Clínicas

 ### 1. Cadastro
POST http://localhost:3000/api/clinics

curl -X POST http://localhost:3000/api/clinics -H "Content-Type: application/json" -d "{"name":"Pet Flow","cnpj":"12345678000100","email":"contato@petflow.com","phone":"31999999999","address":"Rua A","city":"Belo Horizonte","state":"MG","zip_code":"30000000","is_active":true}"

Parâmetros
name: Nome da clínica
cnpj: CNPJ
email: Email
phone: Telefone
address: Endereço
city: Cidade
state: Estado
zip_code: CEP
is_active: Status (true/false)

### 2. Atualização

PUT http://localhost:3000/api/clinics/%7Bid%7D

curl -X PUT http://localhost:3000/api/clinics/ID -H "Content-Type: application/json" -d "{"name":"Pet Flow Atualizada"}"

### 3. Exclusão

DELETE http://localhost:3000/api/clinics/%7Bid%7D

curl -X DELETE http://localhost:3000/api/clinics/ID

## Evidências
### 1. Criação Clínicas
![Evidência de criação](../docs/img/evidencia%20clinica%201.png)
![Evidência de criação](../docs/img/evidencia%20clinica%202.png)

### 2. Exclusão Clínicas
![Evidência de exclusão](../docs/img/evi%20dell%20clinica%201.png)
![Evidência de exclusão](../docs/img/evi%20dell%20clinica%202].png)

### 3. Atualização Clínicas
![Evidência de atualização](../docs/img/evi%20atualizacao%20clinica%202.png)
![Evidência de atualização](../docs/img/evi%20atualizacao%20clinica%201.png)

## Cadastro, exclusão e atualização de Tutores

### 1. Cadastro

POST http://localhost:3000/api/tutors

curl -X POST http://localhost:3000/api/tutors \
-H "Content-Type: application/json" \
-d "{\"name\":\"João Silva\",\"email\":\"joao@email.com\",\"phone\":\"31999999999\"}"

### 2. Atualização

PUT http://localhost:3000/api/tutors/{id}

curl -X PUT http://localhost:3000/api/tutors/ID_DO_TUTOR \
-H "Content-Type: application/json" \
-d "{\"name\":\"João Atualizado\"}"

### 3. Exclusão

DELETE http://localhost:3000/api/tutors/{id}

curl -X DELETE http://localhost:3000/api/tutors/ID_DO_TUTOR

## Evidências

### 1. Criação Tutores
![Evidência de criação](../docs/img/evidencia%20tutor%201.png)
![Evidência de criação](../docs/img/evidencia%20tutor%202.png)


### 2. Exclusão Tutores
![Evidência de exclusão](../docs/img/evi%20dell%20tutor%201.png)
![Evidência de exclusão](../docs/img/evi%20dell%20tutor%202.png)


### 3. Atualização Tutores
![Evidência de atualização](../docs/img/evi%20att%20tutor%202.png)
![Evidência de atualização](../docs/img/evi%20att%20tutor%201.png)


## Cadastro, exclusão e atualização de Pets

### 1. Cadastro
POST http://localhost:3000/api/pets

curl -X POST http://localhost:3000/api/pets -H "Content-Type: application/json" -d "{\"name\":\"Rex\",\"species\":\"cachorro\",\"breed\":\"vira-lata\",\"birth_date\":\"2020-01-01\",\"size\":\"medio\",\"weight\":10,\"color\":\"marrom\",\"gender\":\"macho\",\"tutor_id\":\"ID_DO_TUTOR\"}"

Parâmetros
name: Nome do pet
species: Espécie
breed: Raça
birth_date: Data de nascimento
size: Porte
weight: Peso (numérico)
color: Cor
gender: Sexo
tutor_id: ID do tutor

### 2. Atualização

PUT http://localhost:3000/api/pets/{id}

curl -X PUT http://localhost:3000/api/pets/ID_DO_PET -H "Content-Type: application/json" -d "{\"name\":\"Rex Atualizado\"}"

### 3. Exclusão

DELETE http://localhost:3000/api/pets/{id}

curl -X DELETE http://localhost:3000/api/pets/ID_DO_PET

## Evidências

### 1. Criação Pets
![Evidência de criação](../docs/img/evidencia%20pet%201.png)
![Evidência de criação](../docs/img/evidencia%20pet%202.png)


### 2. Exclusão Pets
![Evidência de exclusão](../docs/img/evi%20dell%20pet%201.png)
![Evidência de exclusão](../docs/img/evi%20dell%20pet%202.png)


### 3. Atualização Pets
![Evidência de atualização](../docs/img/evi%20att%20pet%202.png)
![Evidência de atualização](../docs/img/evi%20att%20pet%201.png)


## Cadastro, exclusão e atualização de Vacinas

### 1. Cadastro

POST http://localhost:3000/api/vaccines

curl -X POST http://localhost:3000/api/vaccines -H "Content-Type: application/json" -d "{\"pet_id\":\"ID_PET\",\"name\":\"V10\",\"date\":\"2026-01-01\"}"

Parâmetros
pet_id: ID do pet
name: Nome da vacina
date: Data da aplicação

### 2. Atualização

PUT http://localhost:3000/api/vaccines/{id}

curl -X PUT http://localhost:3000/api/vaccines/ID -H "Content-Type: application/json" -d "{\"name\":\"V10 Atualizada\"}"

### 3. Exclusão

DELETE http://localhost:3000/api/vaccines/{id}

curl -X DELETE http://localhost:3000/api/vaccines/ID


## Evidências

### 1. Criação Vacinas
![Evidência de criação](../docs/img/evi%20vacina%201.png)
![Evidência de criação](../docs/img/evi%20vacina%202.png)


### 2. Exclusão Vacinas
![Evidência de exclusão](../docs/img/evi%20dell%20vacina%201.png)
![Evidência de exclusão](../docs/img/evi%20dell%20vacina%202.png)


### 3. Atualização Vacinas
![Evidência de atualização](../docs/img/evi%20att%20vacina%202.png)
![Evidência de atualização](../docs/img/evi%20att%20vacina%201.png)



# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.
