# 📘 DOCUMENTAÇÃO TÉCNICA COMPLETA

# Projeto: Proposta Flex

Data de geração: 01/03/2026

------------------------------------------------------------------------

# 1. VISÃO GERAL

## 1.1 Nome do Projeto

**Proposta Flex**

## 1.2 Objetivo

Sistema SaaS web responsivo para auxiliar profissionais autônomos e
pequenas empresas na criação e gestão de orçamentos e propostas
comerciais.

------------------------------------------------------------------------

# 2. ARQUITETURA GERAL

## 2.1 Stack Tecnológica

### Backend

-   Python 3
-   FastAPI
-   SQLite3 / MongoDB
-   Arquitetura MVC
-   Multi-Tenancy por usuário

### Frontend

-   NextJS
-   Fonte: Poppins
-   Layout com Sidebar
-   Interface minimalista
-   Design moderno e modo Dark / Light

------------------------------------------------------------------------

# 3. ESTRUTURA DE PASTAS (OPÇÃO 1 - PROFISSIONAL)

    proposta-flex/
    │
    ├── backend/
    │   ├── app/
    │   │   ├── config/
    │   │   │   └── database.py
    │   │   ├── models/
    │   │   ├── controllers/
    │   │   ├── routes/
    │   │   ├── schemas/
    │   │   ├── services/
    │   │   ├── utils/
    │   │   └── main.py
    │   ├── requirements.txt
    │   └── .env
    │
    ├── frontend/
    │   ├── app/
    │   ├── components/
    │   ├── services/
    │   ├── styles/
    │   └── package.json
    │
    └── README.md

------------------------------------------------------------------------

# 4. ARQUITETURA MVC EXPLICADA

-   **Model**: Representa as tabelas do banco.
-   **View**: Frontend NextJS.
-   **Controller**: Recebe requisição e chama Services.
-   **Service**: Regra de negócio.
-   **Routes**: Endpoints da API.
-   **Schema**: Validações com Pydantic.

------------------------------------------------------------------------

# 5. BANCO DE DADOS (SQLite3)

## 5.1 Tabela users

-   id (PK)
-   company_name
-   name
-   email (único)
-   whatsapp
-   password_hash
-   created_at

Admin padrão: - usuário: admin@admin.com - senha: admin123

## 5.2 Tabela clients

-   id
-   user_id (FK)
-   name
-   phone
-   email

## 5.3 Tabela products

-   id
-   user_id
-   type (produto/serviço)
-   description
-   value

## 5.4 Tabela proposals

-   id
-   user_id
-   client_id
-   proposal_number (sequencial por usuário)
-   title
-   total_value
-   status (Rascunho, Enviado, Aprovado, Reprovado)
-   proposal_date
-   followup_date
-   public_token
-   notes

## 5.5 Tabela proposal_items

-   id
-   proposal_id
-   product_id
-   description
-   quantity
-   unit_value
-   total_value

------------------------------------------------------------------------

# 6. REGRAS DE NEGÓCIO

-   Multi-tenancy por user_id
-   Email único
-   Senha mínima 6 caracteres
-   Telefone máscara (XX) XXXXX-XXXX
-   Moeda R\$ com separador de milhar
-   Data dd/mm/yyyy
-   Proposta sequencial por usuário
-   Link público com token único
-   Aprovação pública altera status automaticamente

------------------------------------------------------------------------

# 7. FUNCIONALIDADES

## Área Pública

-   Cadastro
-   Login
-   Visualização pública de proposta
-   Aprovar / Reprovar proposta

## Área Logada

### Dashboard

-   Total Clientes
-   Total Propostas
-   Aprovadas
-   Pendentes
-   Valor total aprovado
-   Gráfico últimos 6 meses
-   Lista follow-up hoje com botão WhatsApp

### Clientes

CRUD completo

### Produtos/Serviços

CRUD completo

### Propostas

-   Criar proposta
-   Inserir múltiplos itens
-   Alterar status
-   Enviar WhatsApp
-   Excluir

### Configurações

-   Alterar dados da conta
-   Alterar senha
-   Texto padrão WhatsApp com variável #PROPOSTA#

------------------------------------------------------------------------

# 8. FRONTEND (NextJS)

## Layout

-   Sidebar fixa à esquerda
-   Logo no topo
-   Botão primário azul
-   Botão secundário branco
-   Responsivo
-   UX focado em simplicidade

------------------------------------------------------------------------

# 9. REQUIREMENTS.TXT

    fastapi
    uvicorn
    sqlalchemy
    pydantic
    passlib[bcrypt]
    python-dotenv

------------------------------------------------------------------------

# 10. COMO INSTALAR E EXECUTAR

## Backend

1.  Criar ambiente virtual:

```{=html}
<!-- -->
```
    python -m venv venv

2.  Ativar:

```{=html}
<!-- -->
```
    source venv/bin/activate

3.  Instalar dependências:

```{=html}
<!-- -->
```
    pip install -r requirements.txt

4.  Executar:

```{=html}
<!-- -->
```
    uvicorn app.main:app --reload

## Frontend

    npm install
    npm run dev

------------------------------------------------------------------------

# 11. PREPARADO PARA FUTURO

-   Integração Stripe
-   Integração WhatsApp API
-   Notificações
-   Migração PostgreSQL
-   Plano de assinatura SaaS

------------------------------------------------------------------------

# 12. CONCLUSÃO

Projeto estruturado para escalabilidade, organização e evolução futura,
mantendo código limpo e arquitetura profissional.
