"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  value: number
  suffix?: string
}

export function AnimatedNumber({ value, suffix = "" }: Props) {
  const targetRef = useRef<HTMLSpanElement>(null)
  const startedRef = useRef(false)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const run = () => {
      if (startedRef.current) return
      startedRef.current = true
      if (reduced) {
        setDisplay(value)
        return
      }
      const duration = 1200
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(value * eased))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return <span ref={targetRef}>{display.toLocaleString("fr-FR")}{suffix}</span>
}