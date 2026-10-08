import { Document } from "../../domain/entities/document.entity";
import { DocumentRepository } from "../../application/ports/document.repository";

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
