export type ResetPasswordPageState =
  | { kind: "form"; token: string }
  | { kind: "error"; message: string };

export function resolveResetPasswordPageState(
  token: string | null | undefined,
  error: string | null | undefined,
): ResetPasswordPageState {
  if (error) {
    if (error === "INVALID_TOKEN") {
      return {
        kind: "error",
        message: "Link expirado ou já usado. Peça um novo.",
      };
    }
    return {
      kind: "error",
      message: "Não foi possível abrir o link de redefinição. Peça um novo.",
    };
  }

  const trimmed = token?.trim() ?? "";
  if (!trimmed) {
    return {
      kind: "error",
      message: "Link inválido ou incompleto. Peça um novo.",
    };
  }

  return { kind: "form", token: trimmed };
}
