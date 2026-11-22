export const PATHS = Object.freeze({
  home: "/",
  shop: "/shop",
  product: (id: string) => `/product/${id}`,
  login: "/login",
  meusEbooks: "/meus-ebooks",
  admin: "/admin",
  termos: "/termos",
  privacidade: "/privacidade",
  apiAuth: "/api/auth",
  apiStripeWebhook: "/api/stripe/webhook",
  apiEbookDownload: (id: string) => `/api/ebooks/${id}/download`,
  hash: Object.freeze({
    sobre: "/#sobre",
    materiais: "/#materiais",
    servicos: "/#servicos",
    agendar: "/#agendar",
  }),
});
