import { z } from "zod";

export const uploadBodySchema = z.object({
	file: z.instanceof(File),
	dirname: z.string(),
});

export type UploadBody = z.infer<typeof uploadBodySchema>;

export const uploadResponseSchema = {
	200: z.object({
		message: z.literal("success"),
	}),
	400: z.object({
		error: z.literal("Bad Request"),
		message: z.enum(["File is required", "Invalid file type", "Invalid dirname"]),
	}),
};
