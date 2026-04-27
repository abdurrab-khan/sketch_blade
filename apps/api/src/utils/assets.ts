import { mkdir, writeFile, readFile, rm } from "fs/promises";
import { join, resolve } from "node:path";
import { Readable } from "node:stream";

const DIR = resolve("../assets/");

function normalizeAssetId(id: string) {
   const normalized = id.replace(/[^a-zA-Z0-9._-]/g, "_");
   return normalized || "asset";
}

async function storeAsset(id: string, stream: Readable) {
   await mkdir(DIR, { recursive: true });
   await writeFile(join(DIR, normalizeAssetId(id)), stream);
}

async function loadAsset(id: string) {
   return await readFile(join(DIR, normalizeAssetId(id)));
}

async function removeAsset(id: string) {
   await rm(join(DIR, normalizeAssetId(id)), { force: true });
}

export { storeAsset, loadAsset, removeAsset };
