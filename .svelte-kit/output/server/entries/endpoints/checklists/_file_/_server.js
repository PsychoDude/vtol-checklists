import { e as error } from "../../../../chunks/index.js";
import { readFile } from "node:fs/promises";
import path from "node:path";
async function GET({ params }) {
  const { file } = params;
  const filePath = path.join(process.cwd(), "src", "checklists", file);
  try {
    const content = await readFile(filePath, "utf-8");
    return new Response(content, {
      headers: {
        "Content-Type": "text/plain"
      }
    });
  } catch (e) {
    error(404, "Not found");
  }
}
export {
  GET
};
