import { Document } from "../../domain/entities/document.entity";
import { DocumentRepository } from "../ports/document.repository";
import { DocumentNotFoundError } from "../../../../modules/document/application/errors/document-errors";

export class GetDocumentUseCase {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(id: string): Promise<Document | null> {
    const document = await this.documentRepository.findById(id);

    if (!document) {
      throw new DocumentNotFoundError(id);
    }

    return document;
  }
}
