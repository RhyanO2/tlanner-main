<div align="center">
<img width="30" height="30" alt="logo" src="https://github.com/user-attachments/assets/9f84899b-145c-4b55-bd49-2eaff8451dea" />

<img src="https://img.shields.io/badge/TLanner-Backend-3626a3?style=for-the-badge&logoColor=black" alt="TLanner Backend" />

<br/>
<br/>

**[🇧🇷 Português](#-português) · [🇺🇸 English](#-english)**

<br/>

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat-square&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![CI](https://img.shields.io/github/actions/workflow/status/RhyanO2/tlanner-main/ci.yml?style=flat-square&label=CI&logo=github)

</div>

---

# 🇧🇷 Português

## O que é o TLanner?

**TLanner** é uma web app de planejamento de tarefas — mínimo, direta e sem distrações. O objetivo é simples: organizar o que precisa ser feito, sem complexidade desnecessária.

Este repositório é o backend da aplicação, construído com foco em arquitetura limpa, tipagem forte e práticas de produção real.

---

## Stack

| Camada | Tecnologia | Por quê |
|---|---|---|
| Linguagem | TypeScript | Tipagem estática, segurança em tempo de compilação |
| Framework HTTP | Fastify | Alta performance, baixo overhead, plugins nativos |
| ORM | Drizzle ORM | SQL-first, totalmente tipado, sem magia negra |
| Banco de dados | PostgreSQL | Relacional, robusto, ideal para dados estruturados |
| Autenticação | JWT (jsonwebtoken) | Stateless, padrão de mercado |
| Validação | Zod | Validação e inferência de tipos em runtime |
| Testes | Vitest | Rápido, compatível com ESM, cobertura integrada |
| Documentação | Swagger / Scalar | Interface visual para explorar e testar a API |
| Containers | Docker + Compose | Ambiente isolado e reproduzível |
| Package Manager | pnpm | Eficiente, suporte a workspaces |

---

## Arquitetura

O projeto segue uma **arquitetura modular em camadas**, inspirada em Clean Architecture. Cada camada tem uma responsabilidade bem definida e não depende das camadas externas.

```
src/
├── @types/          # Extensões de tipos globais (ex: FastifyRequest com user)
├── controllers/     # Recebem a request, validam entrada, chamam services
├── services/        # Regras de negócio — independentes do framework
├── routes/          # Definição de rotas e registro de hooks
├── hooks/           # Middlewares (autenticação JWT, autorização)
├── database/        # Schema Drizzle, conexão e queries
├── tests/           # Testes de integração por rota/feature
└── app.ts           # Bootstrap do Fastify (plugins, rotas, config)
```

### Fluxo de uma requisição

```
Request → Route → Hook (JWT) → Controller → Service → Database → Response
```

Essa separação garante que:
- Controllers não contêm lógica de negócio
- Services não conhecem o framework HTTP
- O banco é acessado apenas pela camada de database

---

## Funcionalidades

- ✅ Cadastro de usuários com senha hasheada
- ✅ Login com geração de token JWT
- ✅ CRUD completo de tarefas
- ✅ Isolamento de dados por usuário autenticado
- ✅ Proteção de rotas via hook de autenticação
- ✅ Validação de corpo e parâmetros com Zod
- ✅ Rate limiting por IP
- ✅ Health check endpoint
- ✅ Documentação interativa (Swagger / Scalar)
- ✅ Cobertura de testes automatizada
- ✅ Pipeline de CI a cada Pull Request

---

## Endpoints principais

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/users/register` | Cadastro de usuário | ❌ |
| `POST` | `/users/login` | Login e geração de JWT | ❌ |
| `GET` | `/tasks` | Listar tarefas do usuário | ✅ |
| `POST` | `/tasks` | Criar nova tarefa | ✅ |
| `PUT` | `/tasks/:id` | Editar tarefa | ✅ |
| `DELETE` | `/tasks/:id` | Deletar tarefa | ✅ |
| `GET` | `/health` | Status da API e banco | ❌ |

> A documentação completa e interativa está disponível em `/docs` ao rodar a aplicação.

---

## Como rodar localmente

### Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/RhyanO2/tlanner-main.git
cd tlanner-main

# 2. Instale as dependências
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 4. Suba o banco de dados
docker compose up -d

# 5. Execute as migrations
pnpm db:migrate

# 6. Inicie a aplicação
pnpm dev
```

A API estará disponível em `http://localhost:3000`
A documentação em `http://localhost:3000/docs`

---

## Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar com cobertura
pnpm test:coverage

# Modo watch
pnpm test:watch
```

Os testes cobrem as regras de negócio críticas e o comportamento das rotas de ponta a ponta.

---

## Variáveis de ambiente

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de dados
DATABASE_URL=postgresql://user:password@localhost:5432/tlanner

# JWT
JWT_SECRET=seu_secret_aqui
JWT_EXPIRES_IN=7d
```

---

## CI/CD

A cada Pull Request aberto, o GitHub Actions executa automaticamente:

1. Instalação de dependências
2. Type check com TypeScript
3. Build da aplicação
4. Suite completa de testes
5. Relatório de cobertura

Apenas PRs com todos os checks passando são elegíveis para merge.

---

<br/>

---

# 🇺🇸 English

## What is TLanner?

**TLanner** is a minimal, no-nonsense task planning web app. The goal is simple: organize what needs to get done, without unnecessary complexity.

This repository is the application's backend, built with a focus on clean architecture, strong typing, and real production practices.

---

## Stack

| Layer | Technology | Why |
|---|---|---|
| Language | TypeScript | Static typing, compile-time safety |
| HTTP Framework | Fastify | High performance, low overhead, native plugins |
| ORM | Drizzle ORM | SQL-first, fully typed, no black magic |
| Database | PostgreSQL | Relational, robust, ideal for structured data |
| Authentication | JWT (jsonwebtoken) | Stateless, industry standard |
| Validation | Zod | Runtime validation with type inference |
| Testing | Vitest | Fast, ESM-compatible, built-in coverage |
| Documentation | Swagger / Scalar | Visual interface to explore and test the API |
| Containers | Docker + Compose | Isolated and reproducible environment |
| Package Manager | pnpm | Efficient, workspace support |

---

## Architecture

The project follows a **modular layered architecture**, inspired by Clean Architecture. Each layer has a well-defined responsibility and does not depend on outer layers.

```
src/
├── @types/          # Global type extensions (e.g.: FastifyRequest with user)
├── controllers/     # Receive requests, validate input, call services
├── services/        # Business logic — framework-agnostic
├── routes/          # Route definitions and hook registration
├── hooks/           # Middlewares (JWT authentication, authorization)
├── database/        # Drizzle schema, connection and queries
├── tests/           # Integration tests per route/feature
└── app.ts           # Fastify bootstrap (plugins, routes, config)
```

### Request lifecycle

```
Request → Route → Hook (JWT) → Controller → Service → Database → Response
```

This separation ensures that:
- Controllers contain no business logic
- Services have no knowledge of the HTTP framework
- The database is only accessed through the database layer

---

## Features

- ✅ User registration with hashed passwords
- ✅ Login with JWT token generation
- ✅ Full task CRUD
- ✅ Per-user data isolation
- ✅ Route protection via authentication hook
- ✅ Body and parameter validation with Zod
- ✅ IP-based rate limiting
- ✅ Health check endpoint
- ✅ Interactive API documentation (Swagger / Scalar)
- ✅ Automated test coverage
- ✅ CI pipeline on every Pull Request

---

## Main Endpoints

| Method | Route | Description | Auth |
|---|---|---|---|
| `POST` | `/users/register` | User registration | ❌ |
| `POST` | `/users/login` | Login and JWT generation | ❌ |
| `GET` | `/tasks` | List user tasks | ✅ |
| `POST` | `/tasks` | Create new task | ✅ |
| `PUT` | `/tasks/:id` | Edit task | ✅ |
| `DELETE` | `/tasks/:id` | Delete task | ✅ |
| `GET` | `/health` | API and database status | ❌ |

> Full interactive documentation is available at `/docs` when running the application.

---

## Running locally

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/)

### Step by step

```bash
# 1. Clone the repository
git clone https://github.com/RhyanO2/tlanner-main.git
cd tlanner-main

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Start the database
docker compose up -d

# 5. Run migrations
pnpm db:migrate

# 6. Start the application
pnpm dev
```

The API will be available at `http://localhost:3000`
Documentation at `http://localhost:3000/docs`

---

## Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

Tests cover critical business rules and route behavior end-to-end.

---

## Environment variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tlanner

# JWT
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
```

---

## CI/CD

On every Pull Request, GitHub Actions automatically runs:

1. Dependency installation
2. TypeScript type check
3. Application build
4. Full test suite
5. Coverage report

Only PRs with all checks passing are eligible for merge.

---

<div align="center">

<br/>

Made with ☕ by [RhyanO2](https://github.com/RhyanO2)

</div>
