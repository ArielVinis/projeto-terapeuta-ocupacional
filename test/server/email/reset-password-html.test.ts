import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildResetPasswordEmail } from "../../../src/server/email/reset-password-html.ts";

describe("buildResetPasswordEmail", () => {
  it("inclui nome, url e assunto em html e text", () => {
    const content = buildResetPasswordEmail({
      userName: "Maria",
      resetUrl: "https://example.com/auth/reset-password?token=abc",
    });

    assert.equal(content.subject, "Redefina sua senha");
    assert.match(content.html, /Maria/);
    assert.match(content.html, /https:\/\/example\.com\/auth\/reset-password\?token=abc/);
    assert.match(content.text, /Maria/);
    assert.match(content.text, /https:\/\/example\.com\/auth\/reset-password\?token=abc/);
  });

  it("escapa HTML no nome e na url", () => {
    const content = buildResetPasswordEmail({
      userName: `<img src=x onerror=alert(1)>`,
      resetUrl: `https://example.com/reset?a="b"&c=<d>`,
    });

    assert.doesNotMatch(content.html, /<img/);
    assert.match(content.html, /&lt;img/);
    assert.match(content.html, /&quot;/);
    assert.match(content.html, /&amp;/);
  });

  it("usa saudação genérica quando o nome está vazio", () => {
    const content = buildResetPasswordEmail({
      userName: "   ",
      resetUrl: "https://example.com/reset",
    });

    assert.match(content.text, /^Olá!/);
    assert.match(content.html, /Olá!/);
  });
});
