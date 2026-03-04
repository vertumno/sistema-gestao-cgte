"use client";

import { useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/sidebar";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      triggerRef.current = document.activeElement;
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => {
        const first = panelRef.current?.querySelector<HTMLElement>("a, button, [tabindex]");
        first?.focus();
      });
    } else if (triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 md:hidden" role="dialog" aria-modal="true" aria-label="Menu mobile">
      <button
        type="button"
        aria-label="Fechar menu"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div ref={panelRef} className="relative h-full w-72 bg-surface shadow-2xl border-r border-border">
        <Sidebar onNavigate={onClose} className="w-full border-r-0" />
      </div>
    </div>
  );
}