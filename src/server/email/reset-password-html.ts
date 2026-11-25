export type ResetPasswordEmailContent = {
  userName: string;
  resetUrl: string;
};

export function buildResetPasswordEmail({ userName, resetUrl }: ResetPasswordEmailContent): {
  subject: string;
  html: string;
  text: string;
} {
  const greeting = userName.trim() ? `Olá, ${userName.trim()}!` : "Olá!";
  const subject = "Redefina sua senha";

  const text = [
    greeting,
    "",
    "Recebemos um pedido para redefinir a senha da sua conta.",
    "Abra o link abaixo para escolher uma nova senha:",
    resetUrl,
    "",
    "Se você não pediu isso, ignore este e-mail.",
    "O link expira em cerca de 1 hora.",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:24px;background:#f5f5f4;font-family:system-ui,-apple-system,sans-serif;color:#1c1917;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
    <tr>
      <td>
        <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;">Redefinir senha</h1>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.5;">${escapeHtml(greeting)}</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.5;">
          Recebemos um pedido para redefinir a senha da sua conta. Use o botão abaixo para escolher uma nova senha.
        </p>
        <p style="margin:0 0 24px;text-align:center;">
          <a href="${escapeHtml(resetUrl)}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:15px;font-weight:600;">
            Redefinir senha
          </a>
        </p>
        <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#57534e;">
          Se o botão não funcionar, copie e cole este link no navegador:
        </p>
        <p style="margin:0 0 24px;font-size:13px;line-height:1.5;word-break:break-all;color:#0f766e;">
          ${escapeHtml(resetUrl)}
        </p>
        <p style="margin:0;font-size:13px;line-height:1.5;color:#57534e;">
          Se você não pediu isso, ignore este e-mail. O link expira em cerca de 1 hora.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
