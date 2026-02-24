import { useCallback, useRef, useState } from "react";

type CopyResult = {
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
  reset: () => void;
};

async function fallbackCopy(text: string): Promise<boolean> {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const result = document.execCommand("copy");
  document.body.removeChild(textarea);
  return result;
}

export function useCopyFeedback(): CopyResult {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    setCopied(false);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const copy = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ok = await fallbackCopy(text);
        if (!ok) return false;
      }

      setCopied(true);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { copy, copied, reset };
}