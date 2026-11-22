# Site — Vitória Vizzotto Moreira

**Terapeuta Ocupacional Infantil**

Site profissional com apresentação do trabalho, loja de e-books e área do cliente para downloads.

---

## O que o site faz

| Área                          | Para quem             | O que permite                                     |
| ----------------------------- | --------------------- | ------------------------------------------------- |
| Página inicial                | Visitantes            | Conhecer a abordagem, serviços e agendar contacto |
| Loja (`/shop`)                | Visitantes / clientes | Ver e comprar e-books                             |
| Login                         | Clientes              | Conta com e-mail/senha ou Google                  |
| Meus e-books (`/meus-ebooks`) | Clientes autenticados | Baixar os PDFs comprados                          |
| Admin (`/admin`)              | Você (profissional)   | Criar e atualizar e-books e PDFs                  |
| Termos / Privacidade          | Todos                 | Páginas legais                                    |

Pagamentos: **cartão** e **Pix** (Stripe). Sem boleto.

---

## Como usar no dia a dia

### 1. Conta de administradora

1. Crie uma conta no site (registo ou Google) com o e-mail definido em `ADMIN_EMAIL`.
2. Esse e-mail tem acesso automático a `/admin`.
3. Em alternativa, um técnico pode marcar o campo `role = admin` na base de dados.

### 2. Publicar um e-book

1. Entre em `/admin`.
2. Preencha título, slug (URL amigável), descrição e preço em reais.
3. Envie a capa (URL) e o **PDF** (máx. 20 MB).
4. Guarde. O e-book aparece na loja quando estiver ativo.

### 3. Compra e download (visão do cliente)

1. Cliente faz login.
2. Adiciona e-books ao carrinho e finaliza a compra.
3. Paga com cartão ou Pix no Stripe.
4. Após confirmação do pagamento, o material fica em **Meus e-books**.
5. O download é protegido: só quem comprou consegue baixar.

### 4. Textos e privacidade

- Revise `/termos` e `/privacidade` antes de vender de forma contínua.
- Os PDFs ficam em armazenamento privado (não são links públicos permanentes).

---

## Contactos no site

Os links de WhatsApp / redes no rodapé e no banner de agendamento usam os dados configurados no código da página. Se mudar de número ou Instagram, peça ao técnico para atualizar ou edite os componentes do rodapé / CTA.

---

## Arranque técnico (resumo)

Para quem configura o projeto pela primeira vez:

```bash
npm install
cp .env.example .env   # preencher valores reais
npm run db:push        # criar tabelas no Postgres (Neon)
npm run dev            # http://localhost:3000
```

### Variáveis importantes (`.env`)

| Variável                                    | Função                                            |
| ------------------------------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL` / `BETTER_AUTH_URL`   | URL do site                                       |
| `BETTER_AUTH_SECRET`                        | Segredo da autenticação (obrigatório em produção) |
| `DATABASE_URL`                              | Postgres (Neon)                                   |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Login Google                                      |
| `ADMIN_EMAIL`                               | Seu e-mail de admin                               |
| `STRIPE_*`                                  | Pagamentos (cartão + Pix)                         |
| `BLOB_READ_WRITE_TOKEN`                     | Armazenamento dos PDFs                            |

Detalhes e checklist: pasta [`docs/`](docs/), sobretudo [`docs/12-auditoria-final.md`](docs/12-auditoria-final.md).

### Webhook Stripe (local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o `whsec_...` para `STRIPE_WEBHOOK_SECRET`. Guia: [`docs/09-stripe-cli.md`](docs/09-stripe-cli.md).

---

## Estrutura útil

```
src/app/          → páginas (loja, login, admin, legais)
src/components/   → interface (home, carrinho, etc.)
src/server/       → auth, e-books, Stripe, Blob
src/constants/    → rotas (PATHS) e imagens (ASSETS)
public/assets/    → fotos do site
docs/             → roadmap e notas técnicas
```

---

## Suporte

Dúvidas de conteúdo (textos, fotos, preços): trate com quem mantém o site.  
Problemas de pagamento ou login: verifique Stripe Dashboard, e-mail admin e variáveis de ambiente antes de abrir um pedido técnico.
