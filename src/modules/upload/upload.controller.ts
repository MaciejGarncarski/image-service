import { copyFile, mkdir } from "node:fs/promises";
import { join, normalize } from "node:path";

import { MultipartValue } from "@fastify/multipart";
import { FastifyReply, FastifyRequest } from "fastify";
import { fileTypeFromFile } from "file-type";
import { nanoid } from "nanoid";

import { ACCEPTED_MIMETYPES, config } from "../../config/config.js";
import { UploadBody } from "./upload.schema.js";

export async function uploadHandler(
	request: FastifyRequest<{ Body: UploadBody }>,
	reply: FastifyReply,
) {
	const files = await request.saveRequestFiles();
	const fileField = files[0];

	if (!fileField) {
		return reply.badRequest("File is required");
	}

	const dirnameField = fileField.fields.dirname as MultipartValue<string | undefined>;

	if (!dirnameField) {
		return reply.badRequest("Invalid dirname");
	}

	const dirname = dirnameField.value as string;

	if (dirname.startsWith("..")) {
		return reply.badRequest("Invalid dirname");
	}

	if (!fileField) {
		return reply.badRequest("File is required");
	}

	if (!ACCEPTED_MIMETYPES.includes(fileField.mimetype)) {
		return reply.badRequest("Invalid file type");
	}
	const fileId = nanoid();
	const safeDirname = dirname.replace(/^(\.\.(\/|\\|$))+/, "");
	const safePathname = normalize(
		join(import.meta.dirname, "../../..", config.IMAGE_DIR, safeDirname),
	);

	if (
		!safePathname.startsWith(join(import.meta.dirname, "../../..", config.IMAGE_DIR)) ||
		safePathname.startsWith("..") ||
		safeDirname.startsWith("..")
	) {
		return reply.badRequest("Invalid dirname");
	}

	const fileType = await fileTypeFromFile(fileField.filepath);
	const safeFilePath = normalize(join(safePathname, `${fileId}.${fileType?.ext || "jpg"}`));

	try {
		await mkdir(safePathname, { recursive: true });
		await copyFile(fileField.filepath, safeFilePath);
	} catch (e) {
		console.log(e);
	}

	return reply.send({
		status: "success",
		message: "File uploaded successfully",
		data: {
			fileName: `${fileId}.${fileType?.ext || "jpg"}`,
		},
	});
}
