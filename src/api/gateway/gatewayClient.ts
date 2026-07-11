import { httpClient } from "../http/httpClient";

export interface GatewayConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export interface GatewayRequest<T = unknown> {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: T;
  headers?: Record<string, string>;
}

export interface GatewayResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

const DEFAULT_CONFIG: GatewayConfig = {
  baseUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || "/api",
  timeout: 10_000,
  retries: 2,
};

class GatewayClient {
  private config: GatewayConfig;

  constructor(config: Partial<GatewayConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async request<T>(req: GatewayRequest): Promise<GatewayResponse<T>> {
    const config = {
      method: req.method,
      url: `${this.config.baseUrl}${req.path}`,
      data: req.body,
      timeout: this.config.timeout,
      ...(req.headers ? { headers: req.headers } : {}),
    } as const;
    const response = await httpClient.request<T>(config);

    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  }

  async get<T>(path: string): Promise<GatewayResponse<T>> {
    return this.request<T>({ method: "GET", path });
  }

  async post<T>(path: string, body?: unknown): Promise<GatewayResponse<T>> {
    return this.request<T>({ method: "POST", path, body });
  }

  async put<T>(path: string, body?: unknown): Promise<GatewayResponse<T>> {
    return this.request<T>({ method: "PUT", path, body });
  }

  async delete<T>(path: string): Promise<GatewayResponse<T>> {
    return this.request<T>({ method: "DELETE", path });
  }
}

export const gatewayClient = new GatewayClient();
