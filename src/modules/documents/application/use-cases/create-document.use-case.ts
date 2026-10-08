import { Document } from "../../domain/entities/document.entity";
import { DocumentRepository } from "../ports/document.repository";

interface CreateDocumentInput {
  id: string;
  fileName: string;
  contentType: string;
}

export class CreateDocumentUseCase {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(input: CreateDocumentInput): Promise<Document> {
    const document = Document.create({
      id: input.id,
      fileName: input.fileName,
      contentType: input.contentType,
    });

    await this.documentRepository.save(document);

    return document;
  }
}
