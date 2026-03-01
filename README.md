# Proposta Flex

Sistema SaaS web responsivo para auxiliar profissionais autônomos e pequenas empresas na criação e gestão de orçamentos e propostas comerciais.
## Instalação
```
cd /mnt/okcomputer/output/proposta-flex/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

pip install "bcrypt==4.0.1"

cd /tmp/proposta-flex-frontend  # ou recriar em outro local
npm install
npm run dev
```

## 🚀 Funcionalidades

### Área Pública
- Visualização pública de proposta via link único
- Aprovação/Reprovação de propostas

### Área Logada
- **Dashboard**: Métricas, gráficos e follow-ups
- **Clientes**: CRUD completo
- **Produtos/Serviços**: CRUD completo
- **Propostas**: Criação, gestão e envio
- **Configurações**: Perfil e segurança

## 🛠 Stack Tecnológica

### Backend
- Python 3
- FastAPI
- SQLAlchemy
- SQLite3
- JWT Authentication
- Pydantic

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Axios

## 📁 Estrutura do Projeto

```
proposta-flex/
├── backend/
│   ├── app/
│   │   ├── config/       # Configurações (database)
│   │   ├── models/       # Modelos SQLAlchemy
│   │   ├── schemas/      # Schemas Pydantic
│   │   ├── services/     # Regras de negócio
│   │   ├── routes/       # Endpoints da API
│   │   └── main.py       # Entry point
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript types
│   ├── package.json
│   └── .env
└── README.md
```

## 🚀 Como Executar

### Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar (Linux/Mac)
source venv/bin/activate

# Ativar (Windows)
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Executar
uvicorn app.main:app --reload
```

O backend estará disponível em `http://localhost:8000`

Documentação da API: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Executar
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 🔑 Credenciais Padrão

- **Email**: admin@admin.com
- **Senha**: admin123

## 📊 Banco de Dados

O sistema utiliza SQLite por padrão. O arquivo do banco é criado automaticamente na primeira execução.

### Tabelas

- **users**: Usuários do sistema
- **clients**: Clientes
- **products**: Produtos e serviços
- **proposals**: Propostas comerciais
- **proposal_items**: Itens das propostas

## 🔒 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. O token é armazenado no localStorage e enviado em todas as requisições autenticadas.

## 🌐 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado

### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Criar cliente
- `GET /api/clients/{id}` - Obter cliente
- `PUT /api/clients/{id}` - Atualizar cliente
- `DELETE /api/clients/{id}` - Deletar cliente

### Produtos/Serviços
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `GET /api/products/{id}` - Obter produto
- `PUT /api/products/{id}` - Atualizar produto
- `DELETE /api/products/{id}` - Deletar produto

### Propostas
- `GET /api/proposals` - Listar propostas
- `POST /api/proposals` - Criar proposta
- `GET /api/proposals/{id}` - Obter proposta
- `PUT /api/proposals/{id}` - Atualizar proposta
- `DELETE /api/proposals/{id}` - Deletar proposta
- `POST /api/proposals/{id}/send` - Enviar proposta

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas
- `GET /api/dashboard/followup-today` - Follow-ups de hoje
- `GET /api/dashboard/chart-data` - Dados do gráfico

### Público
- `GET /api/public/proposal/{token}` - Visualizar proposta pública
- `POST /api/public/proposal/{token}/approve` - Aprovar proposta
- `POST /api/public/proposal/{token}/reject` - Reprovar proposta

## 📝 Regras de Negócio

- Multi-tenancy por user_id
- Email único por usuário
- Senha mínima de 8 caracteres
- Proposta sequencial por usuário
- Link público com token único
- Aprovação pública altera status automaticamente

## 🚀 Deploy

### Backend

Recomendado usar Docker ou serviços como:
- Render
- Railway
- Heroku
- AWS

### Frontend

Build para produção:
```bash
cd frontend
npm run build
```

Os arquivos estáticos estarão na pasta `dist/`.

## 📄 Licença

Este projeto é privado e de uso comercial.

---

Desenvolvido com ❤️ para profissionais autônomos e pequenas empresas.
