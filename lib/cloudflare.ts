import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";

config({ path: ".env.local" });

if (!process.env.R2_ACCOUNT_ID) {
  console.error("R2_ACCOUNT_ID missing");
  process.exit(1);
}

if (!process.env.R2_ACCESS_KEY_ID) {
  console.error("R2_ACCESS_KEY_ID missing");
  process.exit(1);
}

if (!process.env.R2_SECRET_ACCESS_KEY) {
  console.error("R2_SECRET_ACCESS_KEY missing");
  process.exit(1);
}

if (!process.env.R2_BUCKET_NAME) {
  console.error("R2_BUCKET_NAME missing");
  process.exit(1);
}

if (!process.env.PFP_BUCKET_NAME) {
  console.error("PFP_BUCKET_NAME missing");
  process.exit(1);
}

if (!process.env.R2_ENDPOINT) {
  console.error("R2_ENDPOINT missing");
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

export async function getPresignedUrl(
  key: string,
  expiresIn?: number,
  bucket?: string
) {
  if (!bucket) {
    bucket = process.env.R2_BUCKET_NAME!;
  } else if (bucket.includes("pfp")) {
    bucket = process.env.PFP_BUCKET_NAME!;
  } else {
    bucket = process.env.R2_BUCKET_NAME!;
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  try {
    const url = await getSignedUrl(R2, command, {
      expiresIn: expiresIn || 60 * 60 * 24,
    });
    return url;
  } catch (error) {
    console.error("Failed to generate presigned URL", error);
    throw new Error("Failed to generate presigned URL");
  }
}

export const BUCKET_NAME = "muse-songs";
export const PFP_BUCKET_NAME = "muse-pfps";
