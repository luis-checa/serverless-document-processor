import type { SQSHandler } from "aws-lambda";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({});
const bucket = process.env.DOCUMENTS_BUCKET;

if (!bucket) {
  throw new Error("DOCUMENTS_BUCKET is not configured");
}

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body);

    // S3 puede enviar un mensaje de prueba.
    if (message.Event === "s3:TestEvent") {
      continue;
    }

    const s3Records = message.Records;

    if (!Array.isArray(s3Records)) {
      throw new Error("Invalid S3 event message");
    }

    for (const s3Record of s3Records) {
      const objectKey = decodeURIComponent(
        s3Record.s3.object.key.replace(/\+/g, " "),
      );

      if (!objectKey.startsWith("documents/")) {
        console.warn("Ignoring unexpected object:", objectKey);
        continue;
      }

      await s3Client.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: objectKey,
        }),
      );

      console.log("Document verified:", {
        objectKey,
      });
    }
  }
};
