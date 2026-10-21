import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { DocumentController } from "./document.controller";

export class DocumentRoutes {
  constructor(private readonly controller: DocumentController) {}

  async handle(
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyResultV2> {
    const method = event.requestContext.http.method;
    const path = event.rawPath;

    if (method === "POST" && path === "/documents") {
      return this.controller.create(event);
    }

    if (method === "GET" && /^\/documents\/[^/]+$/.test(path)) {
      return this.controller.get(event);
    }

    if (method === "DELETE" && /^\/documents\/[^/]+$/.test(path)) {
      return this.controller.delete(event);
    }

    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Route not found" }),
    };
  }
}
