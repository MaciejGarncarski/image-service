import {envSchema} from "env-schema";
import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";

export const schema = z.object({
    PORT: z.string(),
    NODE_ENV: z.enum(["development", "production"] as const).default("development"),
    IMAGE_DIR: z.string(),
    API_KEY: z.string().min(24),
})

export const config = envSchema<z.infer<typeof schema>>({
    schema: zodToJsonSchema(schema)
})

export const environment = config.NODE_ENV