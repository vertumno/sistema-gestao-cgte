import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CopyButton } from "@/components/report/copy-button";

describe("CopyButton", () => {
  it("copies text and shows feedback", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true
    });

    render(<CopyButton text="abc" label="Copiar texto" />);

    await user.click(screen.getByRole("button", { name: "Copiar texto" }));

    expect(writeText).toHaveBeenCalledWith("abc");
    expect(screen.getByText(/Copiado/)).toBeInTheDocument();
  });
});