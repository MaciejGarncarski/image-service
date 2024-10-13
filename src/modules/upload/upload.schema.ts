import { Type } from "@fastify/type-provider-typebox";
import { FastifySchema } from "fastify";

import { StringLiteralUnion } from "../../utils/string-literal-union.js";

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

export const getFileListSchema: FastifySchema = {
	operationId: "getFileList",
	tags: ["Get file list in a folder"],
	security: [
		{
			apiKey: [],
		},
	],
	querystring: Type.Object({
		folderPath: Type.Optional(Type.String()),
	}),
	response: {
		200: Type.Object({
			data: Type.Array(Type.String()),
		}),
		404: {
			$ref: "HttpError",
		},
		500: {
			$ref: "HttpError",
		},
	},
};

export const deleteFileSchema: FastifySchema = {
	tags: ["Delete file"],
	security: [
		{
			apiKey: [],
		},
	],
	params: Type.Object({
		folder: Type.String(),
		file: Type.String(),
	}),
	response: {
		200: Type.Object({
			message: Type.Literal("File deleted"),
		}),
		404: {
			$ref: "HttpError",
		},
		500: {
			$ref: "HttpError",
		},
	},
};
