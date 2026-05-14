"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const contentRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="border-b-2 border-neutral-charcoal">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 px-4 text-left hover:bg-surface-container transition-colors group"
        aria-expanded={isOpen}
      >
        <span className="font-label font-bold text-base md:text-lg uppercase tracking-wider text-foreground group-hover:text-tertiary transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`w-6 h-6 text-tertiary transition-transform duration-300 flex-shrink-0 ml-4 ${
            isOpen ? "rotate-180" : ""
          }`}
          strokeWidth={2}
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight + "px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-4 pb-5 font-body text-base md:text-lg text-outline leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

interface AccordionProps {
  children: React.ReactNode
  className?: string
}

export function Accordion({ children, className = "" }: AccordionProps) {
  return (
    <div className={`border-t-2 border-neutral-charcoal ${className}`}>
      {children}
    </div>
  )
}
