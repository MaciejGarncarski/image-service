import { Static, Type } from "@sinclair/typebox";
import { envSchema } from "env-schema";

import { StringLiteralUnion } from "../utils/string-literal-union.js";

export const HEADER_API_KEY = "x-api-key";

// 5 Megabytes
export const MAX_FILE_SIZE = 1024 * 1024 * 5;

export const MAX_FOLDER_SIZE = 10;

export const ACCEPTED_MIMETYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const nodeEnvSchema = StringLiteralUnion(["development", "production", "test"]);

export const schema = Type.Object({
	PORT: Type.String(),
	NODE_ENV: nodeEnvSchema,
	IMAGE_DIR: Type.String(),
	API_KEY: Type.String({ minLength: 24 }),
});

export const config = envSchema<Static<typeof schema>>({
	schema: schema,
});

export const environment = config.NODE_ENV;
