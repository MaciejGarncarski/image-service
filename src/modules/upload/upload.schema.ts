import { Type } from "@sinclair/typebox";

import { StringLiteralUnion } from "@/utils/string-literal-union.js";

export const uploadResponseSchema = {
	200: Type.Object({
		message: Type.Literal("File uploaded successfully"),
		data: Type.Object({
			fileName: Type.String(),
		}),
	}),
	400: Type.Object({
		error: Type.Literal("Bad Request"),
		message: StringLiteralUnion([
			"File is required",
			"Invalid file type",
			"Invalid folder",
			"Folder is full",
		]),
	}),
	500: Type.Object({
		error: Type.Literal("Internal Server Error"),
		message: Type.String(),
	}),
};
