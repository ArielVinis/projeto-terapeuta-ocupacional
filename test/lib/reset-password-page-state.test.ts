import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveResetPasswordPageState } from "../../src/lib/reset-password-page-state.ts";

describe("resolveResetPasswordPageState", () => {
  it("retorna form com token válido", () => {
    assert.deepEqual(resolveResetPasswordPageState(" abc ", undefined), {
      kind: "form",
      token: "abc",
    });
  });

  it("trata INVALID_TOKEN", () => {
    assert.deepEqual(resolveResetPasswordPageState("x", "INVALID_TOKEN"), {
      kind: "error",
      message: "Link expirado ou já usado. Peça um novo.",
    });
  });

  it("exige token quando não há error", () => {
    assert.equal(resolveResetPasswordPageState("", null).kind, "error");
    assert.equal(resolveResetPasswordPageState(undefined, undefined).kind, "error");
  });
});
