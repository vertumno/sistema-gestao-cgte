"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 md:hidden" role="dialog" aria-label="Menu mobile">
      <button
        type="button"
        aria-label="Fechar menu"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <div className="relative h-full w-72 bg-white shadow-xl">
        <Sidebar onNavigate={onClose} className="w-full border-r-0" />
      </div>
    </div>
  );
}