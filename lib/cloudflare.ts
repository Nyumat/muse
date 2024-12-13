import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";

config({ path: ".env.local" });

const requiredEnvVars = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "PFP_BUCKET_NAME",
    "R2_ENDPOINT",
    "COVERS_BUCKET_NAME",
];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`${envVar} missing`);
        process.exit(1);
    }
});

export const R2 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

interface PresignedUrlParams {
    key: string;
    expiresIn?: number;
    bucket: string;
}

export async function getPresignedUrl({
    key,
    expiresIn,
    bucket
}: PresignedUrlParams) {
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

export const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
export const PFP_BUCKET_NAME = process.env.PFP_BUCKET_NAME!;
export const COVERS_BUCKET_NAME = process.env.COVERS_BUCKET_NAME!;
