# Proposta Flex — Frontend

Next.js 14 + TypeScript + Tailwind CSS

## Setup

```bash
npm install
cp .env.local.example .env.local  # configure API URL
npm run dev
```

Acesse: http://localhost:3000

## Variáveis de ambiente

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Páginas

| Rota | Descrição |
|------|-----------|
| `/login` | Autenticação |
| `/cadastro` | Criar conta |
| `/dashboard` | Métricas e gráficos |
| `/propostas` | CRUD de propostas |
| `/clientes` | CRUD de clientes |
| `/produtos` | CRUD de produtos/serviços |
| `/configuracoes` | Perfil, senha e template WhatsApp |
| `/proposta/[token]` | Página pública de aprovação |
