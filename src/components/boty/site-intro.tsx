"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { shouldPlayIntro } from "@/src/components/boty/site-intro-decision"

const INTRO_KEY = "vivi-intro"
const UNLOCK_MS = 450
const HIDE_MS = 1100

function markStorage() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1")
  } catch {
    /* ignore */
  }
}

function clearIntroPending() {
  document.documentElement.removeAttribute("data-vivi-intro")
}

function hasSeenIntro() {
  try {
    return Boolean(sessionStorage.getItem(INTRO_KEY))
  } catch {
    return false
  }
}

function shouldPlay() {
  if (typeof window === "undefined") return false
  return shouldPlayIntro({
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    hasSeenIntro: hasSeenIntro(),
  })
}

export function SiteIntro() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const [skip, setSkip] = useState(false)

  useLayoutEffect(() => {
    const overlay = overlayRef.current
    const mark = markRef.current
    const dest = document.getElementById("nav-brand")

    let skipTimer = 0
    const dismiss = () => {
      clearIntroPending()
      if (overlay) overlay.style.display = "none"
      // Defer unmount — sync setState in layout effect triggers cascading renders.
      skipTimer = window.setTimeout(() => setSkip(true), 0)
    }

    if (!shouldPlay() || !overlay || !mark || !dest) {
      dismiss()
      return () => {
        window.clearTimeout(skipTimer)
        clearIntroPending()
      }
    }

    overlay.style.display = ""
    mark.style.transform = ""
    mark.style.willChange = ""
    overlay.classList.remove("leave")
    overlay.classList.add("play")

    let left = false
    let unlockTimer = 0
    let hideTimer = 0

    const leave = () => {
      if (left) return
      left = true
      markStorage()
      mark.style.willChange = "transform"

      const from = mark.getBoundingClientRect()
      const to = dest.getBoundingClientRect()
      const dx = to.left + to.width / 2 - (from.left + from.width / 2)
      const dy = to.top + to.height / 2 - (from.top + from.height / 2)
      const scale = Math.max(0.22, Math.min(1, to.width / from.width))
      mark.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
      overlay.classList.add("leave")

      unlockTimer = window.setTimeout(clearIntroPending, UNLOCK_MS)
      hideTimer = window.setTimeout(() => {
        mark.style.willChange = ""
        overlay.style.display = "none"
        setSkip(true)
      }, HIDE_MS)
    }

    const onKey = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "Escape"
      ) {
        event.preventDefault()
        leave()
      }
    }

    overlay.addEventListener("pointerup", leave)
    overlay.addEventListener("keydown", onKey)
    overlay.focus({ preventScroll: true })

    return () => {
      window.clearTimeout(skipTimer)
      window.clearTimeout(unlockTimer)
      window.clearTimeout(hideTimer)
      overlay.removeEventListener("pointerup", leave)
      overlay.removeEventListener("keydown", onKey)
      clearIntroPending()
    }
  }, [])

  if (skip) return null

  return (
    <div
      ref={overlayRef}
      id="site-intro"
      className="site-intro"
      role="button"
      tabIndex={0}
      aria-label="Toque para entrar no site"
    >
      <div className="site-intro-stage">
        <div ref={markRef} id="site-intro-mark" className="site-intro-mark">
          <p className="site-intro-name font-serif tracking-wide">
            <span className="site-intro-first text-primary">Vitoria</span>
            <span className="site-intro-last"> Moreira</span>
          </p>
        </div>

        <div className="site-intro-meta">
          <p className="site-intro-role">Terapeuta Ocupacional</p>
          <p className="site-intro-badge">CREFITO</p>
          <p className="site-intro-line site-intro-line-care">
            Cuidado que acompanha o desenvolvimento
          </p>
          <p className="site-intro-line site-intro-line-focus">
            Integração Sensorial · Autismo · TDAH · Desenvolvimento infantil
          </p>
          <p className="site-intro-line site-intro-line-invite">
            Bem-vindo(a) à terapia com propósito
          </p>
        </div>

        <p className="site-intro-hint">Toque para continuar</p>
      </div>
    </div>
  )
}
