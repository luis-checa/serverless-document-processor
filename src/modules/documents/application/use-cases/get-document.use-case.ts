import { Document } from "../../domain/entities/document.entity";
import { DocumentRepository } from "../ports/document.repository";

export class GetDocumentUseCase {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(id: string): Promise<Document | null> {
    return this.documentRepository.findById(id);
  }
}
