"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Copy, Check } from "lucide-react";

type CopyContactCardProps = {
  type: "email" | "phone" | "location" | "hours";
  value: string;
  label: string;
  icon: "mail" | "phone" | "map" | "clock";
};

export function CopyContactCard({ type, value, label, icon }: CopyContactCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Only copy if it's email or phone
    if (type !== "email" && type !== "phone") return;
    
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    switch (icon) {
      case "mail": return <Mail className="text-neon-yellow group-hover:text-surface transition-colors w-5 h-5" />;
      case "phone": return <Phone className="text-neon-yellow group-hover:text-surface transition-colors w-5 h-5" />;
      case "map": return <MapPin className="text-neon-yellow group-hover:text-surface transition-colors w-5 h-5" />;
      case "clock": return <Clock className="text-neon-yellow group-hover:text-surface transition-colors w-5 h-5" />;
    }
  };

  const isCopyable = type === "email" || type === "phone";

  return (
    <div 
      onClick={isCopyable ? handleCopy : undefined}
      className={`group flex items-center justify-between p-md border border-outline-variant bg-surface-variant/10 hover:border-neon-yellow transition-all ${isCopyable ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-sm overflow-hidden">
        <div className="w-12 h-12 bg-neon-yellow/10 flex items-center justify-center group-hover:bg-neon-yellow transition-colors shrink-0">
          {getIcon()}
        </div>
        <div className="overflow-hidden pr-2">
          <p className="font-label-bold text-on-surface-variant text-[10px] uppercase tracking-widest leading-none mb-1">
            {label}
          </p>
          <p className="font-headline-md text-white truncate text-[16px] md:text-[20px] leading-tight">
            {value}
          </p>
        </div>
      </div>
      
      {isCopyable && (
        <div className="shrink-0 text-neon-yellow/50 group-hover:text-neon-yellow transition-colors px-2">
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </div>
      )}
    </div>
  );
}
