import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";

config({ path: ".env.local" });

if (!process.env.R2_ACCOUNT_ID) {
  console.error("R2_ACCOUNT_ID missing");
  process.exit(1);
}

export const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getPresignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });
  try {
    const url = await getSignedUrl(R2, command, { expiresIn: 60 * 60 * 24 });
    return url;
  } catch (error) {
    console.error("Failed to generate presigned URL", error);
    throw new Error("Failed to generate presigned URL");
  }
}

export const BUCKET_NAME = "muse-songs";
