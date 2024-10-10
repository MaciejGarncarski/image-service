import { join, normalize } from "node:path";

import { Multipart } from "@fastify/multipart";

import { config } from "../../../config/config.js";

export const parseFolderField = (folderField: Multipart | Multipart[] | undefined) => {
	if (!folderField) {
		return undefined;
	}

	if (Array.isArray(folderField)) {
		return undefined;
	}

	if (folderField.type === "file") {
		return undefined;
	}

	const folderFieldValue = folderField.value;

	if (typeof folderFieldValue !== "string") {
		return undefined;
	}

	if (folderFieldValue.startsWith("/") || folderFieldValue.includes("..")) {
		return undefined;
	}

	const safeFolderValue = folderFieldValue.replace(/^(\.\.(\/|\\|$))+/, "");

	return normalize(join(config.IMAGE_DIR, safeFolderValue));
};
