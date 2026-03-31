# Introdução

O mercado de produtos e serviços para animais de estimação tem apresentado crescimento constante no Brasil nas últimas décadas. Segundo dados da Associação Brasileira da Indústria de Produtos para Animais de Estimação (ABINPET), o país está entre os maiores mercados pet do mundo, impulsionado pelo aumento do número de animais de estimação e pela crescente humanização desses animais no ambiente familiar. Esse cenário tem ampliado a demanda por serviços especializados, como banho, tosa e atendimento personalizado.Apesar desse crescimento, muitos estabelecimentos do setor ainda utilizam métodos manuais ou sistemas pouco integrados para o controle de agendamentos, cadastro de clientes e gestão de serviços, o que pode gerar falhas operacionais e dificuldades administrativas. Nesse contexto, a aplicação de tecnologias da informação, especialmente por meio de sistemas distribuídos, apresenta-se como uma alternativa para modernizar e integrar os processos internos, contribuindo para maior organização e eficiência na gestão de pet shops.

## Problema
Pequenos e médios pet shops enfrentam dificuldades na organização de suas operações diárias, como controle de clientes, agendamentos de banho e tosa, registro de serviços e acompanhamento financeiro. Em muitos casos, essas informações são gerenciadas de forma manual ou por meio de ferramentas não integradas, como cadernos, planilhas e aplicativos de mensagens, o que pode gerar conflitos de horário, perda de dados e falhas na comunicação interna.

Esse cenário é comum em estabelecimentos com equipe reduzida, onde o gestor acumula funções administrativas e operacionais. A falta de organização impacta diretamente na eficiência, qualidade do atendimento e na capacidade de controle dentro do pet shop.

## Objetivos

Desenvolver um sistema de gestão integrado para um pet shop, com o objetivo de otimizar e centralizar as principais atividades operacionais e administrativas do estabelecimento. O sistema visa proporcionar maior organização, eficiência e controle dos processos internos, contemplando o gerenciamento de agendamentos, cadastro de clientes e seus respectivos pets, registro de serviços prestados e controle financeiro. Dessa forma, busca-se contribuir para a melhoria do atendimento, apoio à tomada de decisões e aumento da produtividade do negócio por meio da utilização de recursos tecnológicos adequados.

#### Objetivos Específicos

- Criar um módulo de agendamento para controle de horários de serviços como banho, tosa e demais atendimentos oferecidos pelo pet shop.
- Desenvolver um sistema de cadastro de clientes, contendo informações pessoais e de contato dos responsáveis pelos animais.
- Implementar um cadastro de pets, permitindo o registro de dados como nome, espécie, raça, idade e histórico de serviços realizados.
- Garantir a organização, integridade e segurança das informações armazenadas no sistema.

## Justificativa

O setor pet brasileiro figura entre os maiores do mundo e vem crescendo de forma expressiva nos últimos anos. Segundo dados da Associação Brasileira da Indústria de Produtos para Animais de Estimação (Abinpet), o Brasil encerrou 2024 com faturamento de R$ 75,4 bilhões no segmento, alta de 9,6% frente ao ano anterior, com projeção de alcançar R$ 77,2 bilhões em 2025 (ABINPET; IPB, 2024). Em termos de população animal, o país reúne aproximadamente 160,9 milhões de pets, ocupando a terceira posição no ranking mundial, atrás apenas dos Estados Unidos e da China (CRMV-PB, 2024).

Esse crescimento impulsiona a demanda por serviços especializados, como banho, tosa, veterinária e hotelaria, aumentando o volume de operações que os estabelecimentos precisam administrar no dia a dia. Ainda assim, grande parte dos pet shops segue operando de forma manual ou com ferramentas pouco integradas, recorrendo a cadernos, planilhas e aplicativos de mensagens para controlar agendamentos, cadastros e serviços. Esse modelo de gestão tende a gerar conflitos de horário, perda de histórico de atendimentos e sobrecarga sobre o gestor, que muitas vezes acumula tarefas administrativas e operacionais ao mesmo tempo (PETSHOPCONTROL, 2023).

Do lado do cliente, a ausência de um sistema centralizado também se faz sentir: confirmações que não chegam, dificuldade em saber o status do serviço e atendimentos que dependem exclusivamente da disponibilidade telefônica do estabelecimento. Em um setor cada vez mais disputado, esses detalhes têm peso direto na retenção de clientes.

O Pet Flow surge como resposta a esse cenário. Trata-se de uma aplicação distribuída que integra backend, interface web e mobile com o objetivo de centralizar as informações operacionais do pet shop em tempo real, permitindo que gestores e equipes acessem e atualizem dados de qualquer dispositivo. A escolha por uma arquitetura distribuída não é meramente técnica: ela reflete a realidade de um ambiente onde recepcionistas, tosadores e gestores precisam consultar e registrar informações simultaneamente, a partir de pontos distintos, o que torna inviável qualquer solução que não contemple essa natureza concorrente e distribuída das operações.

Mais do que uma ferramenta de digitalização, o Pet Flow se propõe a reduzir o retrabalho administrativo e devolver ao gestor e à equipe mais tempo e atenção para o atendimento em si.

**Referências:**
- ABINPET; IPB. *Release 3º Trimestre 2024*. Disponível em: https://www.gov.br/agricultura/pt-br/assuntos/camaras-setoriais-tematicas/documentos/camaras-setoriais/animais-e-estimacao/2024/41a-ro-05-11-2024/release_3trimestre_abinpet_ipb_2024.pdf. Acesso em: mar. 2026.
- CRMV-PB. *Brasil ocupa o 3º lugar no ranking mundial de países com mais animais domésticos*. Disponível em: https://www.crmvpb.org.br/29077-2/. Acesso em: mar. 2026.
- PETSHOPCONTROL. *7 dificuldades do empreendedor no mercado pet*. Disponível em: https://www.petshopcontrol.com.br/blog/dificuldades-empreendedor-mercado-pet/. Acesso em: mar. 2026.

## Público-Alvo

### 1. Definição Geral
O público-alvo do Pet Flow são pet shops que enfrentam dificuldade na organização de agendamento, controle de serviços (banho e tosa), gestão de clientes e acompanhamento da carga diária de trabalho. Gerando uma maior dificuldade no controle e gestão operacional, portando o Pet Flow busca centralizar as informações e oferecer um controle muito mais simplificado para os pet shops.

### 2. Segmentação

#### 2.1 Segmentação Firmográfica (B2B)
- Tipo de empresa: Pet Shop
- Porte: Qualquer porte de empresa (pequeno, médio e grande)
- Estrutura atual: Gestão manual ou uso de planilhas

#### 2.2 Segmentação Comportamental
- Usa WhatsApp ou telefone para agendamentos
- Possui agenda física ou planilha Excel
- Não possui dashboard operacional
- Tem dificuldade em visualizar:
  - Quantos atendimentos faltam no dia
  - Próximo atendimento
  - Serviços já concluídos
- Perde tempo com retrabalho administrativo

#### 2.3 Segmentação Psicográfica
- Empresário prático
- Focado em produtividade
- Busca organização e previsibilidade
- Sensível a custo, mas valoriza eficiência

### 3. Personas

### 3.1 Isabella Rocha
![Persona 1](img/persona_01.png)

### 3.2 Carlos Mendes
![Persona 2](img/persona_02.png)

# Especificações do Projeto

Para detalhes técnicos sobre requisitos, restrições, catálogo de serviços e modelagem de dados, consulte o documento [Backend APIs](backend-apis.md).

## Design do Sistema:
``` mermaid
%%{init: {'theme':'base','themeVariables':{'background':'#0F172A'}}}%%
flowchart LR

subgraph CLIENTS["💻 Clients"]
direction TB
WEB["Web (React)"]
MOBILE["Clinic Mobile App (React Native)"]
end

subgraph BACKEND["⚙️ Backend Rest (Node.js)"]
direction TB
API["API Gateway"]

subgraph REALTIME["⚡ Backend Realtime (Websocket)"]
WS["WebSocket Gateway"]
end

subgraph SERVICES["🛠️ Services"]
direction TB
CLINIC_SERVICE["Clinic"]
CUSTOMER_SERVICE["Owners & Pets"]
SCHEDULE["Scheduling"]
FINANCIAL["Financial / Payments"]
end

WEBHOOK["Stripe Webhook"]
end

subgraph DATA["🗄️ Database (Supabase)"]
direction LR
SERVICE_DB[(SERVICE)]
CLINIC_DB[(CLINIC)]
CUSTOMER_DB[(CUSTOMER)]
end

subgraph EXTERNAL["🌐 External Services"]
STRIPE["Stripe API"]
end

WEB --> API
MOBILE --> API

WEB <-->|WSS| WS
MOBILE <-->|WSS| WS

API --> CLINIC_SERVICE
API --> CUSTOMER_SERVICE
API --> SCHEDULE
API --> FINANCIAL

CLINIC_SERVICE --> CLINIC_DB
CUSTOMER_SERVICE --> CUSTOMER_DB
FINANCIAL --> SERVICE_DB

SCHEDULE --> WS
FINANCIAL --> WS

FINANCIAL -->|Create Checkout| STRIPE
STRIPE -->|Payment Event| WEBHOOK
WEBHOOK --> FINANCIAL

FINANCIAL -->|Direct Payment| SERVICE_DB

%% Styles
style CLIENTS fill:#334155,stroke:#1E40AF,color:#E5E7EB
style BACKEND fill:#1F2937,stroke:#475569,color:#E5E7EB
style REALTIME fill:#1E3A8A,stroke:#1E40AF,color:#E5E7EB
style SERVICES fill:#1E40AF,stroke:#1E3A8A,color:#E5E7EB
style DATA fill:#111827,stroke:#1E293B,color:#E5E7EB
style EXTERNAL fill:#4338CA,stroke:#312E81,color:#E5E7EB

style WEB fill:#2563EB,color:#fff
style MOBILE fill:#2563EB,color:#fff
style API fill:#0EA5E9,color:#fff
style WS fill:#FBBF24,color:#000

style CLINIC_SERVICE fill:#7C3AED,color:#fff
style CUSTOMER_SERVICE fill:#16A34A,color:#fff
style SCHEDULE fill:#0284C7,color:#fff
style FINANCIAL fill:#DC2626,color:#fff

style WEBHOOK fill:#FACC15,color:#000
style STRIPE fill:#635BFF,color:#fff

style SERVICE_DB fill:#64748B,color:#fff
style CLINIC_DB fill:#64748B,color:#fff
style CUSTOMER_DB fill:#64748B,color:#fff

linkStyle default stroke:#60A5FA,stroke-width:2px
```

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.


## Referência
Introdução
- https://abinpet.org.br/dados-de-mercado
- https://www.abre.org.br/inovacao/mercado-pet-movimenta-r-754-bilhoes-em-2024-e-segue-em-expansao-no-brasil
- https://www.abre.org.br/inovacao/mercado-pet-movimenta-r-754-bilhoes-em-2024-e-segue-em-expansao-no-brasil
- https://zipdo.co/brazil-pet-industry-statistics/
- https://mermaid.js.org/intro/syntax-reference.html