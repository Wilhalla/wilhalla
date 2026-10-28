// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "./markdown-content";

describe("MarkdownContent", () => {
  it("renders build-time compiled markdown HTML", () => {
    render(
      <MarkdownContent
        html={
          '<p>Intro text.</p><p><img src="/gallery/gallery-01.webp" alt="Paard in de wei"></p>'
        }
      />,
    );

    const image = screen.getByRole("img", { name: "Paard in de wei" });

    expect(image.getAttribute("src")).toBe("/gallery/gallery-01.webp");
    expect(screen.getByText("Intro text.")).toBeTruthy();
  });
});
