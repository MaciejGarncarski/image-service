import { Static, Type } from "@sinclair/typebox";
import { Parse } from "@sinclair/typebox/value";
import { envSchema } from "env-schema";

import { StringLiteralUnion } from "../utils/string-literal-union.js";

export const HEADER_API_KEY = "x-api-key";

// 5 Megabytes
const maxFileSizeSchema = Type.Number({ minimum: 1024 });
export const MAX_FILE_SIZE = Parse(maxFileSizeSchema, 1024 * 1024 * 5);

const maxFolderSizeSchema = Type.Number({ minimum: 1 });
export const MAX_FOLDER_SIZE = Parse(maxFolderSizeSchema, 10);

const acceptedMimeTypesSchema = Type.Array(Type.String());
export const ACCEPTED_MIMETYPES = Parse(acceptedMimeTypesSchema, [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/avif",
	"image/svg+xml",
]);

const nodeEnvSchema = StringLiteralUnion(["development", "production", "test"], {
	default: "development",
});

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
