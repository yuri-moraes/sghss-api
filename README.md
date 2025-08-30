# **SGHSS \- API do Sistema de Gestão Hospitalar e de Serviços de Saúde**

## **Visão Geral**

Este repositório contém a API back-end para o Sistema de Gestão Hospitalar e de Serviços de Saúde (SGHSS). O projeto foi desenvolvido como uma solução robusta e escalável para o gerenciamento de usuários (pacientes, profissionais de saúde), agendamentos de consultas e dados de pacientes, seguindo as melhores práticas de arquitetura de software e segurança.

A aplicação é construída sobre o framework **NestJS** e utiliza **TypeScript**, garantindo um código fortemente tipado e de fácil manutenção. O ambiente de desenvolvimento e produção é totalmente containerizado com **Docker**, proporcionando consistência e facilidade de implantação.

## **Principais Funcionalidades**

* **Autenticação e Autorização:** Sistema seguro baseado em JSON Web Tokens (JWT) com autorização por papéis (Role-Based Access Control \- RBAC) para diferentes tipos de usuários (Administrador, Profissional, Paciente).  
* **Gerenciamento de Usuários:** Operações CRUD completas para gerenciar os usuários do sistema.  
* **Gerenciamento de Pacientes:** Operações CRUD para dados específicos de pacientes, com busca paginada e filtros.  
* **Agendamento de Consultas:** Endpoints para criar, visualizar, atualizar e cancelar consultas, respeitando as regras de negócio e permissões de cada usuário.  
* **Ambiente Containerizado:** Configuração completa com Docker e Docker Compose para a API e o banco de dados PostgreSQL.  
* **Migrations de Banco de Dados:** Uso de migrations do TypeORM para um gerenciamento seguro e versionado do schema do banco de dados.  
* **Documentação de API:** Geração automática de documentação interativa com Swagger (OpenAPI).  
* **Validação de Dados:** Validação de entrada robusta utilizando class-validator e Pipes do NestJS.

## **Tecnologias Utilizadas**

* **Framework:** NestJS  
* **Linguagem:** TypeScript  
* **Banco de Dados:** PostgreSQL  
* **ORM:** TypeORM  
* **Containerização:** Docker, Docker Compose  
* **Autenticação:** Bearer Token JWT  
* **Documentação:** Swagger (OpenAPI)

## **Pré-requisitos**

Para executar este projeto localmente, você precisará ter as seguintes ferramentas instaladas:

* [Node.js](https://nodejs.org/) (v18 ou superior)  
* [Docker](https://www.docker.com/get-started)  
* [Docker Compose](https://docs.docker.com/compose/install/)

## **Guia de Instalação e Execução**

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento.

### **1\. Clonar o Repositório**

```git 
git clone https://github.com/seu-usuario/sghss-api.git  
cd sghss-api
```

### **2\. Configurar Variáveis de Ambiente**

Crie um arquivo .env na raiz do projeto, copiando o exemplo .env.example. Este arquivo conterá as variáveis sensíveis da aplicação.

```bash
# Crie o arquivo .env  
touch .env
```

Abra o arquivo .env e adicione o seguinte conteúdo:
```javascript
# Segredo para a assinatura do JSON Web Token (JWT)  
# IMPORTANTE: Use uma chave forte e segura em um ambiente de produção  
JWT_SECRET=EsteEhUmSegredoMuitoForteNaoCompartilhe

# Configurações do Banco de Dados (usadas pelo TypeORM CLI)  
DB_HOST=localhost  
DB_PORT=5432  
DB_USERNAME=postgres  
DB_PASSWORD=secret  
DB_DATABASE=sghss
```

### **3\. Iniciar os Contêineres**

Com o Docker em execução, suba os contêineres da API e do banco de dados com o Docker Compose. O comando \--build garante que a imagem da API seja construída a partir do dockerfile.

```docker
docker-compose up --build
```

A API estará disponível em https://sghss-yuri.fly.dev.

## **Migrations do Banco de Dados**

As alterações no schema do banco de dados são gerenciadas através de migrations do TypeORM.

**Importante:** Os comandos de migration devem ser executados dentro do contêiner da API para garantir a conexão correta com o banco de dados.

### **Gerar uma Nova Migration**

Após fazer alterações nas suas entidades (.entity.ts), gere uma nova migration com o seguinte comando:

```docker
docker-compose exec api npm run migration:generate -n NomeDaSuaMigration
```

*Substitua NomeDaSuaMigration por um nome descritivo (ex: AddTelefoneToPaciente).*

### **Executar Migrations**

Para aplicar todas as migrations pendentes e atualizar o banco de dados, execute:

```docker
docker-compose exec api npm run migration:run
```

## **Documentação da API (Swagger)**

A documentação completa e interativa dos endpoints está disponível através do Swagger UI. Com a aplicação em execução, acesse a seguinte URL no seu navegador:

https://sghss-yuri.fly.dev/api-docs

A documentação permite visualizar todos os endpoints, seus parâmetros, corpos de requisição e respostas esperadas, além de permitir o teste direto das rotas (não se esqueça de usar o botão "Authorize" para testar rotas protegidas).
