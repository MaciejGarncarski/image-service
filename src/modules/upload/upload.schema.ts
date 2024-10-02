import { z } from "zod";

export const uploadResponseSchema = {
	200: z.object({
		status: z.literal("success"),
		message: z.literal("File uploaded successfully"),
		data: z.object({
			fileName: z.string(),
		}),
	}),
	400: z.object({
		error: z.literal("Bad Request"),
		message: z.enum(["File is required", "Invalid file type", "Invalid folder", "Folder is full"]),
	}),
	500: z.object({
		error: z.literal("Internal Server Error"),
		message: z.string(),
	}),
};
