import type { KanboardCategory, KanboardProject, KanboardSubtask, KanboardTask } from "@/types/kanboard";

const DEFAULT_TIMEOUT_MS = 10000;
const RATE_LIMIT_MAX_PER_SEC = 10;

type JsonRpcResponse<T> = {
  jsonrpc: "2.0";
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: number;
};

class KanboardClientError extends Error {
  constructor(
    message: string,
    public readonly kind: "timeout" | "auth" | "connection" | "rpc",
    public readonly causeData?: unknown
  ) {
    super(message);
    this.name = "KanboardClientError";
  }
}

class RateLimiter {
  private readonly timestamps: number[] = [];

  async take(): Promise<void> {
    const now = Date.now();
    while (this.timestamps.length > 0 && now - this.timestamps[0] >= 1000) {
      this.timestamps.shift();
    }

    if (this.timestamps.length < RATE_LIMIT_MAX_PER_SEC) {
      this.timestamps.push(now);
      return;
    }

    const waitMs = 1000 - (now - this.timestamps[0]);
    await new Promise((resolve) => setTimeout(resolve, Math.max(waitMs, 0)));
    return this.take();
  }
}

function parseNumber(value: number | string | undefined): number {
  return Number(value ?? 0);
}

function getAuthHeader(): string {
  const token = process.env.KANBOARD_API_TOKEN;
  if (!token) {
    throw new KanboardClientError(
      "KANBOARD_API_TOKEN nao configurado no ambiente",
      "auth"
    );
  }

  const user = process.env.KANBOARD_API_USER ?? "jsonrpc";
  const pass = process.env.KANBOARD_API_PASSWORD ?? token;
  return `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
}

class KanboardClient {
  private readonly limiter = new RateLimiter();
  private reqId = 0;

  private get apiUrl(): string {
    const url = process.env.KANBOARD_API_URL;
    if (!url) {
      throw new KanboardClientError("KANBOARD_API_URL nao configurada no ambiente", "auth");
    }
    return url;
  }

  private async call<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    await this.limiter.take();

    this.reqId += 1;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader()
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method,
          id: this.reqId,
          params
        }),
        signal: controller.signal
      });

      if (response.status === 401 || response.status === 403) {
        throw new KanboardClientError(
          "Falha de autenticacao na API do Kanboard",
          "auth"
        );
      }

      if (!response.ok) {
        throw new KanboardClientError(
          `Falha de conexao com Kanboard (HTTP ${response.status})`,
          "connection"
        );
      }

      const payload = (await response.json()) as JsonRpcResponse<T>;

      if (payload.error) {
        throw new KanboardClientError(
          `Erro RPC Kanboard: ${payload.error.message}`,
          "rpc",
          payload.error.data
        );
      }

      if (payload.result === undefined) {
        throw new KanboardClientError("Resposta RPC sem campo result", "rpc");
      }

      return payload.result;
    } catch (error) {
      if (error instanceof KanboardClientError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new KanboardClientError("Timeout ao consultar Kanboard", "timeout");
      }

      throw new KanboardClientError(
        "Falha de conexao com Kanboard (connection refused/network)",
        "connection",
        error
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private get projectId(): number {
    const id = process.env.KANBOARD_PROJECT_ID;
    if (!id) throw new KanboardClientError("KANBOARD_PROJECT_ID nao configurado no ambiente", "auth");
    return parseInt(id, 10);
  }

  async getAllTasks(): Promise<KanboardTask[]> {
    const result = await this.call<KanboardTask[]>("getAllTasks", { project_id: this.projectId, status_id: 1 });
    return result.map((task) => ({ ...task, id: parseNumber(task.id) }));
  }

  async getTasksByProject(projectId: number): Promise<KanboardTask[]> {
    const result = await this.call<KanboardTask[]>("getAllTasks", { project_id: projectId });
    return result.map((task) => ({ ...task, id: parseNumber(task.id) }));
  }

  async getAllCategories(): Promise<KanboardCategory[]> {
    const result = await this.call<KanboardCategory[]>("getAllCategories", { project_id: this.projectId });
    return result.map((category) => ({ ...category, id: parseNumber(category.id) }));
  }

  async getProjectById(projectId: number): Promise<KanboardProject> {
    const result = await this.call<KanboardProject>("getProjectById", { project_id: projectId });
    return { ...result, id: parseNumber(result.id) };
  }

  async getAllSubtasks(taskId?: number): Promise<KanboardSubtask[]> {
    if (taskId !== undefined) {
      const result = await this.call<KanboardSubtask[]>("getAllSubtasks", { task_id: taskId });
      return result.map((subtask) => ({ ...subtask, id: parseNumber(subtask.id) }));
    }

    const result = await this.call<KanboardSubtask[]>("getAllSubtasks");
    return result.map((subtask) => ({ ...subtask, id: parseNumber(subtask.id) }));
  }
}

export { KanboardClient, KanboardClientError, RATE_LIMIT_MAX_PER_SEC };
