import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";

describe("useCopyFeedback", () => {
  it("sets copied true then false", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const { result } = renderHook(() => useCopyFeedback());

    await act(async () => {
      await result.current.copy("abc");
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
    vi.useRealTimers();
  });
});