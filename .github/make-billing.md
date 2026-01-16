# Prompt: Configuração de Infraestrutura SaaS (Stripe + Supabase MCP)

**Role:** Arquiteto de Software Sênior & Engenheiro de DevOps.
**Tools Available:** Stripe MCP, Supabase MCP.

**Contexto:**
Estou construindo um SaaS chamado **[NOME_DO_SEU_APP]**. Preciso que você configure a infraestrutura de banco de dados e pagamentos utilizando as ferramentas disponíveis.

**Objetivo:**
Criar e configurar tabelas no Supabase, criar planos de assinatura no Stripe e configurar os webhooks necessários para gerenciar o ciclo de vida da assinatura.

---

## 📋 Variáveis de Configuração

_Antes de iniciar, utilize estes valores:_

- **Nome do App:** [NOME_DO_SEU_APP]
- **Moeda:** [BRL ou USD]
- **Planos Desejados:**
  1. Nome: **[Starter]** | Valor: **[47,00]** (Intervalo: Mensal) em reais
  2. Nome: **[Profissional]** | Valor: **[97,00]** (Intervalo: Mensal) em reais
- **URL do Webhook (Produção ou Dev/Ngrok):** `[SUA_URL]/api/webhooks/stripe`

---

## 🚀 Instruções de Execução

Por favor, execute as seguintes fases sequencialmente utilizando as tools apropriadas.

### FASE 1: Banco de Dados (Via Supabase MCP)

1.  **Verificação:** Verifique se existe a tabela `auth.users`.
2.  **Criação de Tabela:** Execute uma query SQL para criar a tabela `subscriptions` (se não existir) com a seguinte estrutura:
    ```sql
    create table if not exists subscriptions (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users(id) not null,
      stripe_customer_id text,
      stripe_subscription_id text unique,
      status text check (status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid')),
      price_id text,
      current_period_end timestamptz,
      created_at timestamptz default now()
    );
    ```
3.  **Segurança (RLS):**
    - Habilite RLS na tabela `subscriptions`.
    - Crie uma policy que permite `SELECT` apenas se `auth.uid() == user_id`.

### FASE 2: Produtos e Preços (Via Stripe MCP)

1.  Utilize a tool do Stripe para criar os produtos definidos nas "Variáveis de Configuração" acima.
2.  Certifique-se de que cada produto tenha um preço recorrente associado.
3.  **Importante:** Ao final desta etapa, liste no chat os `price_id` gerados (ex: `price_1Pxyz...`) para que eu possa salvar no meu `.env`.

### FASE 3: Webhooks (Via Stripe MCP)

1.  Crie um Webhook Endpoint apontando para a URL definida nas variáveis.
2.  Inscreva este endpoint nos seguintes eventos críticos:
    - `checkout.session.completed`
    - `invoice.payment_succeeded`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
3.  **Importante:** Forneça o `webhook_signing_secret` (ex: `whsec_...`) gerado.

### FASE 4: Documentação e Handler

Após a execução das ferramentas:

1.  Gere um **resumo** do que foi criado.
2.  Escreva o código (TypeScript) para um arquivo de rota de API (Next.js App Router ou Node.js) que processe esses webhooks e atualize a tabela `subscriptions` criada na Fase 1.

---

**Inicie a execução da FASE 1 agora.**
