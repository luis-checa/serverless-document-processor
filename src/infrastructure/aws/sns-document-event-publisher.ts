import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

import type {
  DocumentEventPublisher,
  DocumentProcessedEvent,
} from "../../modules/document/application/ports/document-event-publisher";

export class SnsDocumentEventPublisher implements DocumentEventPublisher {
  constructor(
    private readonly snsClient: SNSClient,
    private readonly topicArn: string,
  ) {}

  async publishDocumentProcessed(event: DocumentProcessedEvent): Promise<void> {
    await this.snsClient.send(
      new PublishCommand({
        TopicArn: this.topicArn,
        Subject: "DOCUMENT_PROCESSED",
        Message: JSON.stringify({
          eventType: "DOCUMENT_PROCESSED",
          ...event,
        }),
      }),
    );
  }
}
