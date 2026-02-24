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

  it("fetches tasks by project", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        jsonrpc: "2.0",
        result: [{ id: "10", title: "Project Task", category_id: 2, column_id: 1 }],
        id: 1
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new KanboardClient();
    const tasks = await client.getTasksByProject(5);

    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(10);
    expect(tasks[0].title).toBe("Project Task");
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.method).toBe("getAllTasks");
    expect(body.params).toEqual({ project_id: 5 });
  });

  it("fetches all categories", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        jsonrpc: "2.0",
        result: [
          { id: "1", name: "Design", project_id: 1 },
          { id: "2", name: "Audiovisual", project_id: 1 }
        ],
        id: 1
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new KanboardClient();
    const categories = await client.getAllCategories();

    expect(categories).toHaveLength(2);
    expect(categories[0].id).toBe(1);
    expect(categories[0].name).toBe("Design");
    expect(categories[1].id).toBe(2);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.method).toBe("getAllCategories");
  });

  it("fetches project by id", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        jsonrpc: "2.0",
        result: { id: "7", name: "CGTE Board" },
        id: 1
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new KanboardClient();
    const project = await client.getProjectById(7);

    expect(project.id).toBe(7);
    expect(project.name).toBe("CGTE Board");
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.method).toBe("getProjectById");
    expect(body.params).toEqual({ project_id: 7 });
  });

  it("fetches subtasks by task id", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        jsonrpc: "2.0",
        result: [{ id: "20", task_id: 3, title: "Subtask A", status: 0 }],
        id: 1
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new KanboardClient();
    const subtasks = await client.getAllSubtasks(3);

    expect(subtasks).toHaveLength(1);
    expect(subtasks[0].id).toBe(20);
    expect(subtasks[0].task_id).toBe(3);
    expect(subtasks[0].title).toBe("Subtask A");
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.method).toBe("getAllSubtasks");
    expect(body.params).toEqual({ task_id: 3 });
  });

  it("raises connection error on network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    const client = new KanboardClient();
    await expect(client.getAllTasks()).rejects.toMatchObject({
      kind: "connection"
    });
  });

  it("keeps rate limit constant", () => {
    expect(RATE_LIMIT_MAX_PER_SEC).toBe(10);
  });
});
