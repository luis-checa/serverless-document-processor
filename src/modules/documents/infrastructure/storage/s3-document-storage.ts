import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({});

export class S3DocumentStorage {
  private readonly bucket: string;

  constructor() {
    const bucket = process.env.DOCUMENTS_BUCKET;

    if (!bucket) {
      throw new Error("DOCUMENTS_BUCKET is not configured");
    }

    this.bucket = bucket;
  }

  async generateUploadUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });
  }
}
