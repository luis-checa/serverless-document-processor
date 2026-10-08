import { DocumentStatus } from "../enums/document-status.enum";

interface DocumentProps {
  id: string;
  fileName: string;
  contentType: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Document {
  private constructor(private readonly props: DocumentProps) {}

  static create(props: {
    id: string;
    fileName: string;
    contentType: string;
  }): Document {
    const now = new Date();

    return new Document({
      ...props,
      status: DocumentStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get fileName(): string {
    return this.props.fileName;
  }

  get contentType(): string {
    return this.props.contentType;
  }

  get status(): DocumentStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  markAsProcessing(): void {
    this.props.status = DocumentStatus.PROCESSING;
    this.props.updatedAt = new Date();
  }

  markAsCompleted(): void {
    this.props.status = DocumentStatus.COMPLETED;
    this.props.updatedAt = new Date();
  }

  markAsFailed(): void {
    this.props.status = DocumentStatus.FAILED;
    this.props.updatedAt = new Date();
  }
}
