/**
 * Node.js loader for ESM module imports without a file extension.
 * Usage: node --loader ./scripts/esm-loader.js ./scripts/name-of-script.js
 */

export const resolve = (specifier, context, nextResolve) => {
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    if (
      !(
        specifier.endsWith(".js") ||
        specifier.endsWith(".mjs") ||
        specifier.endsWith(".cjs")
      )
    ) {
      const newSpecifier = specifier + ".js";
      return nextResolve(newSpecifier, context);
    }
  }
  return nextResolve(specifier, context);
};
