import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PathCardProps = {
  index: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
  delay?: 1 | 2 | 3;
};

export function PathCard({
  index,
  icon: Icon,
  title,
  description,
  cta,
  href,
  external = false,
  delay
}: PathCardProps) {
  const delayClass = delay ? `reveal-delay-${delay}` : "";

  const inner = (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl p-6",
        "border border-border bg-surface",
        "transition-all duration-300",
        "hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(5,150,105,0.12)] hover:-translate-y-1",
        "reveal",
        delayClass
      )}
    >
      {/* Top gradient line — visible on hover */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px",
          "bg-gradient-to-r from-transparent via-primary to-transparent",
          "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        )}
        aria-hidden="true"
      />

      {/* Index */}
      <div className="mb-5 flex items-center justify-between">
        <span className="font-mono text-xs font-medium tracking-widest text-text-subtle">
          {index}
        </span>
      </div>

      {/* Icon */}
      <div
        className={cn(
          "mb-5 flex h-14 w-14 items-center justify-center rounded-xl",
          "border border-border bg-bg",
          "transition-all duration-300",
          "group-hover:border-primary/30 group-hover:bg-primary/5"
        )}
        aria-hidden="true"
      >
        <Icon
          size={28}
          className="text-text-muted transition-colors duration-300 group-hover:text-primary"
          strokeWidth={1.5}
        />
      </div>

      {/* Title */}
      <h2 className="font-display text-lg font-semibold leading-snug text-text">
        {title}
      </h2>

      {/* Description */}
      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
        {description}
      </p>

      {/* Divider */}
      <div className="my-5 h-px bg-border" aria-hidden="true" />

      {/* CTA */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text-muted transition-colors duration-300 group-hover:text-primary">
          {cta}
        </span>
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            "border border-border text-text-subtle",
            "transition-all duration-300",
            "group-hover:border-primary/40 group-hover:bg-primary/8 group-hover:text-primary"
          )}
          aria-hidden="true"
        >
          {external ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 6h8M7 3l3 3-3 3" />
            </svg>
          )}
        </span>
      </div>
    </div>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${title} — abre em nova aba`}
        className="block h-full rounded-xl outline-none focus-glow"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={href}
      aria-label={title}
      className="block h-full rounded-xl outline-none focus-glow"
    >
      {inner}
    </Link>
  );
}
