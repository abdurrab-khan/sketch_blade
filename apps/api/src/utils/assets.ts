import { mkdir, writeFile, readFile } from "fs/promises";
import { join, resolve } from "node:path";
import { Readable } from "node:stream";

const DIR = resolve("../assets/");

async function storeAsset(id: string, stream: Readable) {
   await mkdir(DIR, { recursive: true });
   await writeFile(join(DIR, id), stream);
}

async function loadAsset(id: string) {
   return await readFile(join(DIR, id));
}

// import _unfurl from 'unfurl.js'
//
// export async function unfurl(url: string) {
// 	const { title, description, open_graph, twitter_card, favicon } = await _unfurl.unfurl(url)
//
// 	const image = open_graph?.images?.[0]?.url || twitter_card?.images?.[0]?.url
//
// 	return {
// 		title,
// 		description,
// 		image,
// 		favicon,
// 	}
// }

export { storeAsset, loadAsset };
