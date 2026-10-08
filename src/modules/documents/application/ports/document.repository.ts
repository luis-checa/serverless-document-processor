import { Document } from "../../domain/entities/document.entity";

export interface DocumentRepository {
  save(document: Document): Promise<void>;
  findById(id: string): Promise<Document | null>;
  delete(id: string): Promise<void>;
}
