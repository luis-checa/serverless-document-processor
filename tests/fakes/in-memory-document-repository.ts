import type { DocumentRepository } from "../../src/modules/documents/application/ports/document.repository";
import type { Document } from "../../src/modules/documents/domain/entities/document.entity";

export class InMemoryDocumentRepository implements DocumentRepository {
  private readonly documents = new Map<string, Document>();

  async save(document: Document): Promise<void> {
    this.documents.set(document.id, document);
  }

  async findById(id: string): Promise<Document | null> {
    return this.documents.get(id) ?? null;
  }

  async delete(id: string): Promise<void> {
    this.documents.delete(id);
  }
}
