import { join, normalize } from "node:path";

import { MultipartValue } from "@fastify/multipart";

import { config } from "../../../config/config.js";

export const parseFolderField = (folderField: MultipartValue<string | undefined>) => {
	if (!folderField) {
		return undefined;
	}

	const folderValue = folderField.value as string;

	if (folderValue.startsWith("..") || folderValue.startsWith("/") || folderValue.includes("..")) {
		return undefined;
	}

	const safeFolderValue = folderValue.replace(/^(\.\.(\/|\\|$))+/, "");
	const safePathname = normalize(join(config.IMAGE_DIR, safeFolderValue));

	if (
		safeFolderValue.startsWith("..") ||
		!safePathname.startsWith(config.IMAGE_DIR) ||
		safePathname.startsWith("..")
	) {
		return undefined;
	}

	return safePathname;
};
