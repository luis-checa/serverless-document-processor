import { DocumentRepository } from "../ports/document.repository";

export class DeleteDocumentUseCase {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(id: string): Promise<void> {
    await this.documentRepository.delete(id);
  }
}
