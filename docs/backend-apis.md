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

[Liste os principais endpoints da API, incluindo as operações disponíveis, os parâmetros esperados e as respostas retornadas.]

### Endpoint 1
- Método: GET
- URL: /endpoint1
- Parâmetros:
  - param1: [descrição]
- Resposta:
  - Sucesso (200 OK)
    ```
    {
      "message": "Success",
      "data": {
        ...
      }
    }
    ```
  - Erro (4XX, 5XX)
    ```
    {
      "message": "Error",
      "error": {
        ...
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

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.
