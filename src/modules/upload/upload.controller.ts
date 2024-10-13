import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import { join, normalize } from "node:path";

import { FastifyReply, FastifyRequest } from "fastify";
import { fileTypeFromBuffer } from "file-type";
import { nanoid } from "nanoid";

import { ACCEPTED_MIMETYPES, config, MAX_FOLDER_SIZE } from "../../config/config.js";
import { parseFolderField } from "./utils/parse-folder-field.js";

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

	const safePathname = parseFolderField(file.fields.folder);

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

export const getFileListHandler = async (
	request: FastifyRequest<{ Querystring: { folderPath?: string } }>,
	reply: FastifyReply,
) => {
	const folder = request.query.folderPath;

	if (!folder) {
		try {
			const dir = await readdir(config.IMAGE_DIR);
			return reply.send({ data: dir });
		} catch {
			return reply.notFound();
		}
	}

	try {
		const dir = await readdir(`${config.IMAGE_DIR}/${folder}`);
		return reply.send({ data: dir });
	} catch {
		return reply.notFound();
	}
};

export const deleteFileHandler = async (
	request: FastifyRequest<{ Params: { folder: string; file: string } }>,
	reply: FastifyReply,
) => {
	const folder = request.params.folder;
	const file = request.params.file;

	try {
		await unlink(`${config.IMAGE_DIR}/${folder}/${file}`);
		return reply.send({ message: "File deleted" });
	} catch {
		return reply.notFound();
	}
};
