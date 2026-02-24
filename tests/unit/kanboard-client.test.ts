import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { KanboardClient, RATE_LIMIT_MAX_PER_SEC } from "@/lib/kanboard-client";

describe("KanboardClient", () => {
  beforeEach(() => {
    process.env.KANBOARD_API_URL = "https://kanboard.example/jsonrpc.php";
    process.env.KANBOARD_API_TOKEN = "token-test";
    delete process.env.KANBOARD_API_USER;
    delete process.env.KANBOARD_API_PASSWORD;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.KANBOARD_API_USER;
    delete process.env.KANBOARD_API_PASSWORD;
  });

  it("uses token auth with default jsonrpc user", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        jsonrpc: "2.0",
        result: [{ id: "1", title: "Task A", category_id: 1, column_id: 1 }],
        id: 1
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new KanboardClient();
    const tasks = await client.getAllTasks();

    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(1);
    const firstCall = fetchMock.mock.calls[0][1] as RequestInit;
    const authHeader = (firstCall.headers as Record<string, string>).Authorization;
    expect(authHeader).toBe(`Basic ${Buffer.from("jsonrpc:token-test").toString("base64")}`);
  });

  it("respects custom auth user/password when explicitly configured", async () => {
    process.env.KANBOARD_API_USER = "custom-user";
    process.env.KANBOARD_API_PASSWORD = "custom-pass";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        jsonrpc: "2.0",
        result: [{ id: "1", title: "Task A", category_id: 1, column_id: 1 }],
        id: 1
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new KanboardClient();
    await client.getAllTasks();

    const firstCall = fetchMock.mock.calls[0][1] as RequestInit;
    const authHeader = (firstCall.headers as Record<string, string>).Authorization;
    expect(authHeader).toBe(`Basic ${Buffer.from("custom-user:custom-pass").toString("base64")}`);
  });

  it("raises auth error on unauthorized response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401
      })
    );

    const client = new KanboardClient();
    await expect(client.getAllTasks()).rejects.toMatchObject({
      kind: "auth"
    });
  });

  it("raises timeout error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("Timeout", "AbortError")));
    const client = new KanboardClient();
    await expect(client.getAllTasks()).rejects.toMatchObject({
      kind: "timeout"
    });
  });

  it("keeps rate limit constant", () => {
    expect(RATE_LIMIT_MAX_PER_SEC).toBe(10);
  });
});
