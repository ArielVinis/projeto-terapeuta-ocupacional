/** Decisão pura da intro (testável sem DOM). */
export function shouldPlayIntro(input: {
  reducedMotion: boolean
  hasSeenIntro: boolean
}): boolean {
  if (input.reducedMotion) return false
  return !input.hasSeenIntro
}

/** Limpa o lock de scroll/marca do boot se a intro não arrancar a tempo. */
export const INTRO_FAILSAFE_MS = 8_000
