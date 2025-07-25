import { describe, it, expect } from "vitest";
import { pascalToTitle } from "../utils";

describe("pascalToTitle", () => {
  it("should convert PascalCase to Title Case", () => {
    expect(pascalToTitle("PascalCaseString")).toBe("Pascal Case String");
  });

  it("should handle single word", () => {
    expect(pascalToTitle("Word")).toBe("Word");
  });

  it("should handle all lowercase to title", () => {
    expect(pascalToTitle("lowercase")).toBe("Lowercase");
  });

  it("should return an empty string for null or undefined input", () => {
    expect(pascalToTitle(null)).toBe("");
    expect(pascalToTitle(undefined)).toBe("");
  });
});