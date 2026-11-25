import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  INTRO_FAILSAFE_MS,
  shouldPlayIntro,
} from "../../../src/components/boty/site-intro-decision.ts";

describe("shouldPlayIntro", () => {
  it("não toca com reduced motion", () => {
    assert.equal(shouldPlayIntro({ reducedMotion: true, hasSeenIntro: false }), false);
  });

  it("não toca se já foi vista na sessão", () => {
    assert.equal(shouldPlayIntro({ reducedMotion: false, hasSeenIntro: true }), false);
  });

  it("toca na primeira visita sem reduced motion", () => {
    assert.equal(shouldPlayIntro({ reducedMotion: false, hasSeenIntro: false }), true);
  });
});

describe("INTRO_FAILSAFE_MS", () => {
  it("é longo o bastante para a animação e curto para recovery", () => {
    assert.ok(INTRO_FAILSAFE_MS >= 5_000);
    assert.ok(INTRO_FAILSAFE_MS <= 15_000);
  });
});
