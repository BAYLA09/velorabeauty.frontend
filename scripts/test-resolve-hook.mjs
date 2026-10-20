import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const srcRoot = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..", "src");

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const filePath = path.join(srcRoot, specifier.slice(2)) + ".ts";
    return nextResolve(pathToFileURL(filePath).href, context);
  }
  if (
    specifier.startsWith("./") &&
    !specifier.endsWith(".ts") &&
    context.parentURL?.includes("/src/config/")
  ) {
    const parentDir = path.dirname(fileURLToPath(context.parentURL));
    const filePath = path.join(parentDir, specifier) + ".ts";
    return nextResolve(pathToFileURL(filePath).href, context);
  }
  return nextResolve(specifier, context);
}
