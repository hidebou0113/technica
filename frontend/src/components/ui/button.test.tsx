import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("表示した場合_ボタン名を確認できること", () => {
    render(<Button>登録する</Button>);

    expect(
      screen.getByRole("button", { name: "登録する" })
    ).toBeInTheDocument();
  });

  it("クリックした場合_クリック処理が呼ばれること", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>登録する</Button>);

    await user.click(screen.getByRole("button", { name: "登録する" }));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("無効な場合_クリック処理が呼ばれないこと", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        登録する
      </Button>
    );

    const button = screen.getByRole("button", { name: "登録する" });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
