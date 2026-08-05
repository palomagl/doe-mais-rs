# Doe+ RS

Aplicativo Doe+ RS para gestão de doadores, perfil, doações, recompensas e hemocentros.

## Tecnologias usadas

- Vite + React + TypeScript
- Tailwind CSS
- Supabase para autenticação, banco de dados e storage
- Capacitor para empacotar o app como mobile

## Rodar localmente

1. Instale dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env` na raiz com as variáveis:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   ```
3. Inicie o app:
   ```bash
   npm run dev
   ```

## Build de produção

```bash
npm run build
```

## Deploy no Vercel

1. Conecte seu repositório ao Vercel.
2. Configure o projeto como app Vite.
3. Use:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Adicione as variáveis de ambiente no painel do Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Faça deploy e o frontend ficará hospedado na Vercel.

## Banco de dados online

O app já está preparado para usar **Supabase** como banco de dados remoto.

1. Crie um projeto em https://app.supabase.com
2. Copie o `URL` e a `anon key`
3. Defina esses valores nas variáveis de ambiente do Vercel
4. Se você quiser aplicar a estrutura do banco localmente, use o Supabase CLI com as migrations existentes em `supabase/migrations`

> O código da aplicação lê as variáveis em `src/integrations/supabase/client.ts`.

## Observações

- O deploy no Vercel serve o frontend.
- O banco de dados precisa ficar em um serviço online separado (Supabase é recomendado e já suportado).
- Se precisar, posso ajudar a gerar o projeto Supabase e configurar as migrations.
