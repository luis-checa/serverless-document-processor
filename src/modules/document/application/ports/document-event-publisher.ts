export interface DocumentProcessedEvent {
  documentId: string;
  fileName: string;
  processedAt: string;
}

export interface DocumentEventPublisher {
  publishDocumentProcessed(event: DocumentProcessedEvent): Promise<void>;
}
