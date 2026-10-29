import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { S3DocumentStorage } from "../../modules/documents/infrastructure/storage/s3-document-storage";
import { CreateDocumentUseCase } from "../../modules/documents/application/use-cases/create-document.use-case";
import { GetDocumentUseCase } from "../../modules/documents/application/use-cases/get-document.use-case";
import { DeleteDocumentUseCase } from "../../modules/documents/application/use-cases/delete-document.use-case";
import { InMemoryDocumentRepository } from "../../modules/documents/infrastructure/repositories/in-memory-document.repository";
import { DocumentController } from "../../modules/documents/presentation/http/document.controller";
import { DocumentRoutes } from "../../modules/documents/presentation/http/document.routes";
import { handleHttpError } from "../http/error-handler";

const documentRepository = new InMemoryDocumentRepository();
const documentStorage = new S3DocumentStorage();

const documentController = new DocumentController(
  new CreateDocumentUseCase(documentRepository),
  new GetDocumentUseCase(documentRepository),
  new DeleteDocumentUseCase(documentRepository),
  documentStorage,
);

const documentRoutes = new DocumentRoutes(documentController);

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  try {
    return await documentRoutes.handle(event);
  } catch (error) {
    return handleHttpError(error);
  }
}
