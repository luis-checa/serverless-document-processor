import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { randomUUID } from "node:crypto";

import { CreateDocumentUseCase } from "../../application/use-cases/create-document.use-case";
import { GetDocumentUseCase } from "../../application/use-cases/get-document.use-case";
import { DeleteDocumentUseCase } from "../../application/use-cases/delete-document.use-case";
import { S3DocumentStorage } from "../../infrastructure/storage/s3-document-storage";
export class DocumentController {
  constructor(
    private readonly createDocument: CreateDocumentUseCase,
    private readonly getDocument: GetDocumentUseCase,
    private readonly deleteDocument: DeleteDocumentUseCase,
    private readonly documentStorage: S3DocumentStorage,
  ) {}

  async create(
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyResultV2> {
    let body: unknown;

    try {
      body = JSON.parse(event.body ?? "");
    } catch {
      return this.json(400, { message: "Invalid JSON body" });
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("fileName" in body) ||
      !("contentType" in body) ||
      typeof body.fileName !== "string" ||
      typeof body.contentType !== "string" ||
      !body.fileName.trim() ||
      !body.contentType.trim()
    ) {
      return this.json(400, {
        message: "fileName and contentType are required",
      });
    }

    const id = randomUUID();
    const key = `documents/${id}`;

    const document = await this.createDocument.execute({
      id,
      fileName: body.fileName.trim(),
      contentType: body.contentType.trim(),
    });

    const uploadUrl = await this.documentStorage.generateUploadUrl(
      key,
      document.contentType,
    );

    return this.json(201, {
      id: document.id,
      fileName: document.fileName,
      contentType: document.contentType,
      status: document.status,
      uploadUrl,
      uploadMethod: "PUT",
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    });
  }

  async get(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const id = event.pathParameters?.id;

    if (!id) {
      return this.json(400, { message: "Document ID is required" });
    }

    const document = await this.getDocument.execute(id);

    if (!document) {
      return this.json(404, { message: "Document not found" });
    }

    return this.json(200, {
      id: document.id,
      fileName: document.fileName,
      contentType: document.contentType,
      status: document.status,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    });
  }

  async delete(
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyResultV2> {
    const id = event.pathParameters?.id;

    if (!id) {
      return this.json(400, { message: "Document ID is required" });
    }

    const document = await this.getDocument.execute(id);

    if (!document) {
      return this.json(404, { message: "Document not found" });
    }

    await this.deleteDocument.execute(id);

    return {
      statusCode: 204,
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    };
  }

  private json(statusCode: number, body: unknown): APIGatewayProxyResultV2 {
    return {
      statusCode,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
  }
}
