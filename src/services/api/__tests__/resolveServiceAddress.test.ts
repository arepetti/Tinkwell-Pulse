import { describe, it, expect, vi } from "vitest";
import { resolveServiceAddress } from "../resolveServiceAddress";

// Mock fetch
global.fetch = vi.fn();

describe("resolveServiceAddress", () => {
  it("should resolve service address from host", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve("http://localhost:8080"),
    } as Response);

    const address = await resolveServiceAddress("store");
    expect(address).toBe("http://localhost:8080");
  });
});
