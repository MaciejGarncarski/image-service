import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join, normalize } from "node:path";

import { MultipartValue } from "@fastify/multipart";
import { FastifyReply, FastifyRequest } from "fastify";
import { fileTypeFromBuffer } from "file-type";
import { nanoid } from "nanoid";

import { ACCEPTED_MIMETYPES, MAX_FOLDER_SIZE } from "@/config/config.js";
import { parseFolderField } from "@/modules/upload/utils/parse-folder-field.js";

export async function uploadHandler(request: FastifyRequest, reply: FastifyReply) {
	const file = await request.file();

	if (!file) {
		return reply.badRequest("File is required");
	}

	const fileBuffer = await file.toBuffer();
	const fileType = await fileTypeFromBuffer(fileBuffer);

	if (!fileType || !ACCEPTED_MIMETYPES.includes(fileType.mime)) {
		return reply.badRequest("Invalid file type");
	}

	const folderField = file.fields.folder as MultipartValue<string | undefined>;

	const safePathname = parseFolderField(folderField);

	if (!safePathname) {
		return reply.badRequest("Invalid folder");
	}

	const fileId = nanoid();
	const safeFilePath = normalize(join(safePathname, `${fileId}.${fileType.ext}`));

	await mkdir(safePathname, { recursive: true });

	const fileList = await readdir(safePathname);

	if (fileList.length >= MAX_FOLDER_SIZE) {
		return reply.badRequest("Folder is full");
	}

	await writeFile(safeFilePath, fileBuffer);

	return reply.send({
		message: "File uploaded successfully",
		data: {
			fileName: `${fileId}.${fileType.ext}`,
		},
	});
}
