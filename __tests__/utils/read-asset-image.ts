import { readFileSync } from "node:fs";
import path from "node:path";

export function readAssetImage(assetName: string) {
	return new Blob([readFileSync(path.join("__tests__/assets/", assetName))]);
}
