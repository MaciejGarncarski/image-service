import { envSchema } from "env-schema";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const HEADER_API_KEY = "x-api-key";

// 5 Megabytes
export const MAX_FILE_SIZE = 1024 * 1024 * 5;

export const MAX_FOLDER_SIZE = 10;

export const ACCEPTED_MIMETYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const schema = z.object({
	PORT: z.string(),
	NODE_ENV: z.enum(["development", "production", "test"] as const).default("development"),
	IMAGE_DIR: z.string(),
	API_KEY: z.string().min(24),
});

export const config = envSchema<z.infer<typeof schema>>({
	schema: zodToJsonSchema(schema),
});

export const environment = config.NODE_ENV;
