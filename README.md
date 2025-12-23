# TLanner API 🚀

API backend para gerenciamento de tarefas com autenticação JWT, desenvolvida com foco em **boas práticas de arquitetura**, **tipagem forte**, **testes automatizados** e **preparo para ambiente real de produção**.

Este projeto foi pensado como uma API real — não apenas um CRUD de estudo — priorizando organização, clareza e decisões técnicas conscientes.

---

## 📌 Visão geral

A **TLanner API** permite:
- Cadastro e autenticação de usuários
- Criação, listagem, edição e exclusão de tarefas
- Proteção de rotas com JWT
- Persistência em banco relacional
- Execução em ambiente isolado com Docker
- Testes automatizados de regras críticas

---

## 🧱 Stack principal

### **Frameworks & Linguagem**
- **Node.js**
- **TypeScript**
- **Fastify** – framework HTTP focado em performance e baixo overhead

### **Banco de dados**
- **PostgreSQL**
- **Drizzle ORM** – ORM moderno, tipado e explícito (SQL-first)

### **Autenticação & Segurança**
- **JWT (jsonwebtoken)**
- Hooks de autenticação no Fastify
- Tipagem customizada do `request.user`

### **Testes**
- **Vitest**
- Testes de integração focados em rotas e regras de negócio

### **Infra & Ferramentas**
- **Docker / Docker Compose**
- **pnpm** – gerenciador de pacotes
- **Prettier** – padronização de código
- **Zod** – validação e tipagem de schemas
- **dotenv** – variáveis de ambiente

---

## 🧠 Arquitetura

O projeto segue uma **arquitetura modular**, inspirada em princípios de *Clean Architecture*, mantendo responsabilidades bem definidas.

### Camadas principais

- **Routes**
  - Definição das rotas HTTP
  - Associação com controllers
  - Registro de hooks (ex: autenticação)

- **Controllers**
  - Orquestram a requisição
  - Validam entrada
  - Chamam regras de negócio

- **Services**
  - Regras de negócio
  - Lógica independente de framework

- **Database**
  - Schemas do Drizzle
  - Configuração de conexão
  - Queries tipadas

- **Hooks / Middlewares**
  - Autenticação JWT
  - Proteção de rotas

Essa separação evita:
- controllers inchados
- lógica de negócio acoplada ao framework
- dependência direta do banco nas rotas

---

## 📁 Estrutura de pastas

```bash
├── drizzle/                 # Migrações e schema do banco
├── src/
│   ├── @types/              # Tipagens globais (ex: FastifyRequest)
│   ├── controllers/         # Controllers das rotas
│   ├── database/            # Conexão, schemas e queries
│   ├── hooks/               # Hooks de autenticação
│   ├── routes/              # Definição das rotas
│   ├── services/            # Regras de negócio
│   ├── tests/               # Testes automatizados
│   └── app.ts               # Configuração principal do Fastify
├── docker-compose.yml
├── drizzle.config.ts
├── tsconfig.json
├── package.json
└── README.md
