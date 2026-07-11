import { gatewayClient } from "../gateway/gatewayClient";

export interface JmapApiRequest {
  using: string[];
  methodCalls: Array<[string, Record<string, unknown>, string]>;
}

export interface JmapApiResponse {
  methodResponses: Array<[string, Record<string, unknown>, string]>;
  createdIds?: Record<string, string>;
}

class JmapClient {
  async call(requests: JmapApiRequest): Promise<JmapApiResponse> {
    const response = await gatewayClient.post<JmapApiResponse>(
      "/jmap",
      requests,
    );
    return response.data;
  }

  async getSession() {
    const response =
      await gatewayClient.get<Record<string, unknown>>("/jmap/session");
    return response.data;
  }
}

export const jmapClient = new JmapClient();
