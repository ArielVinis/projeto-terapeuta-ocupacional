export const PATHS = Object.freeze({
  home: "/",
  shop: "/shop",
  product: (id: string) => `/product/${id}`,

  login: "/login",
  meusEbooks: "/meus-ebooks",

  admin: {
    root: "/admin",
    ebooks: "/admin/ebooks",
    sales: "/admin/sales",
  },

  api: {
    auth: "/api/auth",
    stripeWebhook: "/api/stripe/webhook",
    ebookDownload: (id: string) => `/api/ebooks/${id}/download`,
  },

  termos: "/termos",
  privacidade: "/privacidade",

  hash: Object.freeze({
    sobre: "/#sobre",
    materiais: "/#materiais",
    servicos: "/#servicos",
    agendar: "/#agendar",
  }),
});
