"use client";

import { useState } from "react";
import type { FAQ as FAQType } from "@/lib/mockData";

export function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="border-2 border-outline-variant bg-surface-container hover:border-primary transition-colors cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="p-md flex justify-between items-center">
        <h4 className="font-display-md text-xl text-on-surface uppercase">{question}</h4>
        <span className="material-symbols-outlined text-primary">
          {isOpen ? "remove" : "add"}
        </span>
      </div>
      {isOpen && (
        <div className="p-md pt-0 border-t-2 border-outline-variant mt-sm">
          <p className="font-body-md text-on-surface-variant">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function FAQ({ faqs }: { faqs: FAQType[] }) {
  return (
    <section id="info" className="py-3xl px-gutter max-w-container-max mx-auto">
      <h3 className="font-display-lg text-[40px] md:text-[64px] text-on-surface uppercase mb-xl border-b-4 border-primary inline-block">
        INFO / FAQ
      </h3>
      
      <div className="space-y-sm max-w-3xl">
        {faqs.map((faq) => (
          <FAQItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </section>
  );
}
