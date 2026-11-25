export const PATHS = Object.freeze({
  home: "/",
  shop: "/shop",
  product: (id: string) => `/product/${id}`,

  auth: {
    root: "/auth",
    login: "/auth/login",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },

  profile: {
    root: "/profile",
    ebooks: "/profile/ebooks",
    password: "/profile/password",
  },

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
