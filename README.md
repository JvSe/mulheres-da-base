# Sorteador de Nomes — Mulheres da Base

Sistema de sorteio com cadastro via QR Code. As participantes escaneiam o QR Code e se cadastram; o organizador realiza o sorteio em outra página.

## Estrutura

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com links |
| `/participar` | Cadastro para participantes (destino do QR Code) |
| `/sorteio` | Área do organizador para realizar o sorteio |

## Configuração

### 1. Dependências

Requer **Node.js 20.19+** (ou 22.12+). Usa **Prisma 7** com adapter PostgreSQL.

```bash
pnpm install
```

### 2. Banco de dados (Supabase)

1. Crie um projeto no [Supabase](https://supabase.com)
2. Em **Project Settings > Database**, copie a connection string
3. Crie `.env` a partir do `.env.example`:

```bash
cp .env.example .env
```

4. Preencha as variáveis:
   - `DATABASE_URL` — connection pooler (porta 6543), com `?pgbouncer=true`
   - `DIRECT_URL` — conexão direta (porta 5432)

### 3. Migrations

```bash
pnpm db:push
```

Isso cria a tabela `Participant` no Supabase.

## Uso

1. **QR Code**: gere um QR Code apontando para `https://seu-dominio.com/participar`
2. **Participantes**: escaneiam, acessam `/participar` e cadastram o nome
3. **Organizador**: acessa `/sorteio` para ver os nomes e realizar o sorteio

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build para produção |
| `pnpm db:push` | Sincroniza o schema com o banco (Supabase) |
| `pnpm db:migrate` | Cria migration (para versionamento) |
