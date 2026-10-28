import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "../i18n/index.js";
import { ModelNotice } from "./ModelNotice.jsx";

describe("ModelNotice", () => {
  it("explains that real predictions need a configured model", () => {
    render(<ModelNotice />);
    expect(screen.getByText("AI model not configured")).toBeTruthy();
    expect(screen.getByText(/No predictions are generated until then/)).toBeTruthy();
  });
});
