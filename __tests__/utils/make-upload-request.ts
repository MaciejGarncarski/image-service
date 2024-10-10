import { FastifyInstance } from "fastify";

import { testConfig } from "../test-config.js";
import { readAssetImage } from "./read-asset-image.js";

type UploadRequest = {
	fastify: FastifyInstance;
	testFile?: string;
	folder?: string;
};

export async function makeUploadRequest({ fastify, testFile, folder }: UploadRequest) {
	const formData = new FormData();
	const assetFile = testFile ? readAssetImage(testFile) : undefined;

	if (assetFile) {
		formData.append("file", assetFile);
	}

	if (folder) {
		formData.append("folder", folder);
	}

	return fastify.inject({
		method: "POST",
		url: "/upload",
		payload: formData,
		headers: {
			"x-api-key": testConfig.API_KEY,
		},
	});
}
