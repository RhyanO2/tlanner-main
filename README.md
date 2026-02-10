# TLanner API - Guia Prático de Uso 🚀

Guia completo e prático para configurar, executar e testar a TLanner API do zero. Perfeito para desenvolvedores que querem começar rapidamente!

---

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando a Aplicação](#-executando-a-aplicação)
- [Testando a API](#-testando-a-api)
- [Executando Testes Automatizados](#-executando-testes-automatizados)
- [Usando o Drizzle Studio](#-usando-o-drizzle-studio)
- [Resolução de Problemas](#-resolução-de-problemas)
- [Próximos Passos](#-próximos-passos)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Obrigatórios

✅ **Node.js** (versão 18 ou superior)
```bash
# Verificar versão instalada
node --version
# Deve mostrar v18.x.x ou superior

# Se não tiver, baixe em: https://nodejs.org/
```

✅ **pnpm** (gerenciador de pacotes)
```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Verificar instalação
pnpm --version
# Deve mostrar 8.x.x ou superior
```

✅ **Docker Desktop** (para banco de dados)
```bash
# Verificar se está instalado
docker --version
docker-compose --version

# Se não tiver, baixe em: https://www.docker.com/products/docker-desktop/
```

### Opcional (mas recomendado)

- **Git** - para clonar o repositório
- **Visual Studio Code** - editor de código
- **Postman** ou **Insomnia** - para testar endpoints
- **DBeaver** ou **pgAdmin** - para visualizar o banco de dados

---

## 📥 Instalação

### Passo 1: Clone o repositório

```bash
# Via HTTPS
git clone https://github.com/RhyanO2/tlanner-main.git

# Ou via SSH
git clone git@github.com:RhyanO2/tlanner-main.git

# Entre na pasta do projeto
cd tlanner-main
```

### Passo 2: Instale as dependências

```bash
# Instalar todas as dependências do projeto
pnpm install

# Aguarde... isso pode levar alguns minutos na primeira vez
```

**O que acontece aqui?**
- O pnpm lê o arquivo `package.json`
- Baixa todas as bibliotecas necessárias
- Cria a pasta `node_modules/`

---

## ⚙️ Configuração

### Passo 3: Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env (use seu editor preferido)
nano .env
# ou
code .env
```

**Configuração mínima necessária:**

```env
# .env
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Banco de dados (não altere se for usar Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tlanner

# IMPORTANTE: Altere este secret!
JWT_SECRET=meu-secret-super-secreto-123456

# Tempo de expiração do token
JWT_EXPIRES_IN=7d

# Rate limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_TIME_WINDOW=15m

# Logging
LOG_LEVEL=info

# CORS (URL do seu frontend)
CORS_ORIGIN=http://localhost:5173
```

> ⚠️ **IMPORTANTE**: O `JWT_SECRET` deve ser alterado! Em produção, use um valor forte e aleatório.

### Passo 4: Inicie o banco de dados

```bash
# Inicia o PostgreSQL em container Docker
docker-compose up -d

# O comando "up" cria e inicia o container
# O "-d" executa em background (detached mode)
```

**Verificar se está rodando:**

```bash
# Listar containers ativos
docker ps

# Você deve ver algo como:
# CONTAINER ID   IMAGE         PORTS                    NAMES
# abc123def456   postgres:15   0.0.0.0:5432->5432/tcp   tlanner-db
```

**Ver logs do banco (se necessário):**

```bash
docker-compose logs -f postgres
```

### Passo 5: Execute as migrations

```bash
# Cria as tabelas no banco de dados
pnpm db:migrate

# Você verá algo como:
# Applying migration: 0001_create_users_table.sql
# Applying migration: 0002_create_tasks_table.sql
# ✓ Migrations applied successfully
```

**O que acontece aqui?**
- Lê os arquivos `.sql` da pasta `drizzle/migrations/`
- Executa cada migration no banco PostgreSQL
- Cria as tabelas `users` e `tasks`

### Passo 6 (Opcional): Popule com dados de teste

```bash
# Insere usuários e tarefas de exemplo
pnpm db:seed

# Você verá:
# ✓ Created 3 test users
# ✓ Created 10 test tasks
# ✓ Database seeded successfully
```

---

## 🚀 Executando a Aplicação

### Modo Desenvolvimento (com hot reload)

```bash
# Inicia o servidor em modo de desenvolvimento
pnpm dev
```

**Saída esperada:**

```
Server listening at http://localhost:3000
Documentation available at http://localhost:3000/docs

{"level":30,"time":1707567890123,"msg":"Server listening at http://0.0.0.0:3000"}
```

✅ **Pronto! A API está rodando!**

Acesse no navegador:
- **API**: http://localhost:3000
- **Documentação**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health

### Modo Produção

```bash
# 1. Compile o projeto
pnpm build

# 2. Execute o build
pnpm start
```

---

## 🧪 Testando a API

### Método 1: Usando cURL (Terminal)

#### 1. Health Check

```bash
curl http://localhost:3000/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-10T12:00:00.000Z",
  "uptime": 42,
  "database": "connected"
}
```

#### 2. Registrar um novo usuário

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQw..."
}
```

> 💡 **Copie o `token`** - você precisará dele para as próximas requisições!

#### 3. Fazer login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

#### 4. Criar uma tarefa (requer autenticação)

```bash
# Substitua {SEU_TOKEN} pelo token recebido no registro/login
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {SEU_TOKEN}" \
  -d '{
    "title": "Estudar TypeScript",
    "description": "Revisar tipos avançados e generics",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-02-15"
  }'
```

**Resposta esperada:**
```json
{
  "task": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "title": "Estudar TypeScript",
    "description": "Revisar tipos avançados e generics",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-02-15T00:00:00.000Z",
    "createdAt": "2024-02-10T12:00:00.000Z",
    "updatedAt": "2024-02-10T12:00:00.000Z"
  }
}
```

#### 5. Listar todas as tarefas

```bash
curl -X GET http://localhost:3000/api/v1/tasks \
  -H "Authorization: Bearer {SEU_TOKEN}"
```

#### 6. Buscar tarefa específica

```bash
# Substitua {TASK_ID} pelo ID da tarefa
curl -X GET http://localhost:3000/api/v1/tasks/{TASK_ID} \
  -H "Authorization: Bearer {SEU_TOKEN}"
```

#### 7. Atualizar uma tarefa

```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/{TASK_ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {SEU_TOKEN}" \
  -d '{
    "status": "completed"
  }'
```

#### 8. Deletar uma tarefa

```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/{TASK_ID} \
  -H "Authorization: Bearer {SEU_TOKEN}"
```

---

### Método 2: Usando a Documentação Interativa (Swagger)

**A maneira mais fácil de testar!**

1. **Acesse**: http://localhost:3000/docs

2. **Registre um usuário**:
   - Expanda `POST /api/v1/auth/register`
   - Clique em "Try it out"
   - Preencha os dados:
     ```json
     {
       "name": "Maria Santos",
       "email": "maria@example.com",
       "password": "senha456"
     }
     ```
   - Clique em "Execute"
   - **Copie o token** da resposta

3. **Autentique na documentação**:
   - Clique no botão "Authorize" 🔓 no topo
   - Cole o token no campo `Bearer {token}`
   - Clique em "Authorize"
   - Agora todas as requisições usarão esse token!

4. **Teste os endpoints**:
   - Agora você pode testar todos os endpoints de tarefas
   - Os exemplos já vêm preenchidos
   - Basta clicar em "Execute"

---

### Método 3: Usando Postman

1. **Importe a collection**:
   - Abra o Postman
   - Import > Link
   - Cole: `http://localhost:3000/docs/json`
   - Isso importa todos os endpoints automaticamente!

2. **Configure variáveis**:
   - Crie um Environment "TLanner Local"
   - Adicione variável `baseUrl` = `http://localhost:3000`
   - Adicione variável `token` = (deixe vazio por enquanto)

3. **Registre um usuário**:
   - Selecione `POST /auth/register`
   - Body > raw > JSON:
     ```json
     {
       "name": "Pedro Costa",
       "email": "pedro@example.com",
       "password": "senha789"
     }
     ```
   - Send
   - Copie o `token` da resposta

4. **Configure autenticação**:
   - Cole o token na variável `{{token}}`
   - Ou configure Authorization:
     - Type: Bearer Token
     - Token: `{{token}}`

5. **Teste os endpoints protegidos**:
   - Agora você pode usar todos os endpoints de tarefas
   - Eles já estarão configurados com autenticação

---

### Método 4: Script de teste rápido

Crie um arquivo `test-api.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:3000"

echo "1. Health Check..."
curl $API_URL/health
echo -e "\n"

echo "2. Registrando usuário..."
RESPONSE=$(curl -s -X POST $API_URL/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "teste123"
  }')

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo -e "\n"

echo "3. Criando tarefa..."
curl -X POST $API_URL/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Tarefa de teste",
    "description": "Criada via script",
    "status": "pending",
    "priority": "medium"
  }'
echo -e "\n"

echo "4. Listando tarefas..."
curl -X GET $API_URL/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"
```

Execute:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 🧪 Executando Testes Automatizados

### Tipos de Testes

#### 1. Testes Unitários
Testam funções e lógica isoladas.

```bash
# Executar todos os testes uma vez
pnpm test

# Executar em modo watch (monitora alterações)
pnpm test:watch

# Executar com cobertura de código
pnpm test:coverage
```

**Saída esperada:**

```
 ✓ src/services/auth.service.test.ts (5)
   ✓ AuthService
     ✓ should hash password correctly
     ✓ should validate correct password
     ✓ should reject invalid password
     ✓ should generate valid JWT token
     ✓ should verify JWT token

 ✓ src/services/tasks.service.test.ts (8)
   ✓ TasksService
     ✓ should create task
     ✓ should list user tasks
     ✓ should update task
     ✓ should delete task
     ...

Test Files  4 passed (4)
     Tests  25 passed (25)
  Start at  12:00:00
  Duration  1.23s
```

#### 2. Testes de Integração (E2E)

Testam fluxos completos da API.

```bash
# Executar testes E2E
pnpm test:e2e
```

**O que é testado:**
- ✅ Registro de usuário
- ✅ Login
- ✅ Criação de tarefas
- ✅ Listagem de tarefas
- ✅ Atualização de tarefas
- ✅ Deleção de tarefas
- ✅ Validações de autenticação
- ✅ Validações de entrada

#### 3. Cobertura de Testes

```bash
# Gerar relatório de cobertura
pnpm test:coverage
```

**Saída esperada:**

```
---------------------------|---------|----------|---------|---------|-------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------------|---------|----------|---------|---------|-------------------
All files                  |   85.32 |    78.45 |   87.12 |   85.89 |                   
 controllers               |   92.15 |    85.32 |   95.00 |   92.50 |                   
  auth.controller.ts       |   95.00 |    88.00 |  100.00 |   95.50 | 45-47            
  tasks.controller.ts      |   90.00 |    82.00 |   90.00 |   90.00 | 78-82,105        
 services                  |   88.50 |    82.15 |   90.00 |   89.00 |                   
  auth.service.ts          |   92.00 |    85.00 |   95.00 |   92.50 | 23-25            
  tasks.service.ts         |   85.00 |    79.30 |   85.00 |   85.50 | 56-60,89-92      
 utils                     |   76.00 |    68.00 |   70.00 |   76.50 |                   
  jwt.ts                   |   80.00 |    70.00 |   75.00 |   80.50 | 12-15            
  hash.ts                  |   72.00 |    66.00 |   65.00 |   72.50 | 8-10,18-20       
---------------------------|---------|----------|---------|---------|-------------------
```

**Ver relatório HTML:**

```bash
# Após executar test:coverage, abra:
open coverage/index.html

# Ou no Linux:
xdg-open coverage/index.html
```

### Estrutura dos Testes

```
src/tests/
├── integration/          # Testes de endpoints completos
│   ├── auth.test.ts     # Testa registro e login
│   ├── tasks.test.ts    # Testa CRUD de tarefas
│   └── health.test.ts   # Testa health checks
├── unit/                # Testes de lógica isolada
│   ├── services/
│   │   ├── auth.service.test.ts
│   │   └── tasks.service.test.ts
│   └── utils/
│       ├── jwt.test.ts
│       └── hash.test.ts
└── helpers/             # Utilitários para testes
    ├── setup.ts         # Configuração inicial
    └── teardown.ts      # Limpeza após testes
```

### Exemplo de Teste

```typescript
// src/tests/integration/auth.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { build } from '../../app'

describe('Auth API', () => {
  let app

  beforeAll(async () => {
    app = await build()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should register a new user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toHaveProperty('token')
    expect(response.json().user.email).toBe('test@example.com')
  })

  it('should reject duplicate email', async () => {
    // First registration
    await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        name: 'User One',
        email: 'duplicate@example.com',
        password: 'password123'
      }
    })

    // Duplicate registration
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        name: 'User Two',
        email: 'duplicate@example.com',
        password: 'password456'
      }
    })

    expect(response.statusCode).toBe(409)
    expect(response.json().error).toContain('already exists')
  })
})
```

---

## 🎨 Usando o Drizzle Studio

O Drizzle Studio é uma interface visual para gerenciar o banco de dados.

### Iniciar o Drizzle Studio

```bash
pnpm db:studio
```

**Saída:**

```
Drizzle Studio is running at https://local.drizzle.studio
```

### Funcionalidades

1. **Visualizar dados**:
   - Navegue entre as tabelas `users` e `tasks`
   - Veja todos os registros em formato de tabela

2. **Editar dados**:
   - Clique em qualquer célula para editar
   - Salva automaticamente no banco

3. **Adicionar registros**:
   - Clique em "+ Add row"
   - Preencha os campos
   - Salvar

4. **Deletar registros**:
   - Selecione linhas
   - Clique em "Delete"

5. **Executar queries SQL**:
   - Aba "SQL Runner"
   - Execute queries customizadas
   - Veja resultados em tempo real

### Exemplos de Queries no Studio

```sql
-- Ver todos os usuários
SELECT * FROM users;

-- Ver tarefas de um usuário específico
SELECT * FROM tasks 
WHERE user_id = 'uuid-do-usuario';

-- Contar tarefas por status
SELECT status, COUNT(*) as total 
FROM tasks 
GROUP BY status;

-- Ver tarefas atrasadas
SELECT * FROM tasks 
WHERE due_date < CURRENT_DATE 
AND status != 'completed';
```

---

## 🛠️ Resolução de Problemas

### Problema: "Port 3000 already in use"

**Solução 1**: Matar o processo na porta 3000
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

**Solução 2**: Usar outra porta
```bash
# Edite o .env
PORT=3001

# Ou execute com variável de ambiente
PORT=3001 pnpm dev
```

---

### Problema: "Cannot connect to database"

**Verificar se Docker está rodando:**
```bash
docker ps
```

**Se não estiver rodando:**
```bash
docker-compose up -d
```

**Verificar logs do container:**
```bash
docker-compose logs postgres
```

**Resetar o banco (CUIDADO: deleta tudo):**
```bash
docker-compose down -v
docker-compose up -d
pnpm db:migrate
```

---

### Problema: "JWT token invalid"

**Causas comuns:**
- Token expirado (padrão: 7 dias)
- JWT_SECRET diferente entre requisições
- Token malformatado

**Solução:**
1. Faça login novamente para obter novo token
2. Verifique se o `.env` não mudou
3. Confirme formato: `Bearer {token}`

---

### Problema: Migrations não aplicam

```bash
# Limpar e recriar
pnpm db:reset

# Ou manualmente:
docker-compose down -v  # Remove volumes
docker-compose up -d    # Recria container
pnpm db:migrate        # Aplica migrations
```

---

### Problema: "Module not found"

```bash
# Reinstalar dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

### Problema: Testes falhando

```bash
# Verificar variáveis de ambiente de teste
cat .env

# Executar testes com mais informações
pnpm test --reporter=verbose

# Executar um teste específico
pnpm test src/tests/integration/auth.test.ts
```

---

## 🎯 Próximos Passos

Agora que você tem a API rodando:

### 1. Explorar a documentação
- Acesse http://localhost:3000/docs
- Teste todos os endpoints
- Leia os schemas de validação

### 2. Desenvolver features
- Adicione novos campos às tarefas
- Implemente filtros avançados
- Crie categorias/tags

### 3. Melhorar testes
- Aumentar cobertura para >90%
- Adicionar testes de performance
- Criar testes de carga

### 4. Deploy
- Configure CI/CD
- Deploy no Railway/Render
- Configure variáveis de produção

### 5. Integrar frontend
- Crie aplicação React/Vue
- Use o token JWT
- Implemente refresh tokens

---

## 📚 Recursos Adicionais

- **Documentação Fastify**: https://www.fastify.io/
- **Drizzle ORM**: https://orm.drizzle.team/
- **Vitest**: https://vitest.dev/
- **TypeScript**: https://www.typescriptlang.org/

---

## 💡 Dicas

✅ **Use o modo watch**: `pnpm dev` reinicia automaticamente  
✅ **Drizzle Studio**: Visualize dados facilmente  
✅ **Swagger UI**: Melhor forma de testar endpoints  
✅ **Git hooks**: Configure pre-commit para rodar testes  
✅ **Docker Compose**: Mantenha ambiente consistente  

---

<div align="center">

**Dúvidas? Problemas?**

[Abra uma issue](https://github.com/RhyanO2/tlanner-main/issues) ou entre em contato!

🚀 **Bom desenvolvimento!**

</div>
