import fs from "fs/promises";
import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";

marked.use(gfmHeadingId());

const md = await fs.readFile(process.argv[2], "utf-8");
await fs.writeFile(process.argv[3], marked(md, { mangle: false }));
