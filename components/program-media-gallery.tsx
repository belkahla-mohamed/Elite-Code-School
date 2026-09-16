"use client"

import { useState } from "react"
import { X, CaretLeft, CaretRight } from "@phosphor-icons/react"
import { createPortal } from "react-dom"
import { imgSrc } from "@/lib/image-url-server"

interface Props {
  images: string[]
  mainImage: string
  title: string
}

export function ProgramMediaGallery({ images, mainImage, title }: Props) {
  const allImages = images.length > 0 ? images : [mainImage]
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  function prev() { setActive((a) => (a === 0 ? allImages.length - 1 : a - 1)) }
  function next() { setActive((a) => (a === allImages.length - 1 ? 0 : a + 1)) }

  return (
    <>
      <div className="overflow-hidden rounded-brand border border-border dark:border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc(allImages[active], 1200)}
          alt={title}
          className="aspect-[4/3] w-full cursor-pointer object-cover transition hover:opacity-95"
          onClick={() => setLightbox(true)}
        />
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto p-2 scrollbar-none">
            {allImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  i === active ? "border-brand" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgSrc(src, 200)} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)} className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
            <X className="size-6" />
          </button>
          {allImages.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                <CaretLeft className="size-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                <CaretRight className="size-6" />
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc(allImages[active], 2000)}
            alt={title}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </>
  )
}
