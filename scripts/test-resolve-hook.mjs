import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const srcRoot = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..", "src");

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const filePath = path.join(srcRoot, specifier.slice(2)) + ".ts";
    return nextResolve(pathToFileURL(filePath).href, context);
  }
  return nextResolve(specifier, context);
}
