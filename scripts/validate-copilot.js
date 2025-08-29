import { readFileSync } from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

try {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const scripts = new Set(Object.keys(pkg.scripts || {}));
  const text = readFileSync(".github/copilot-instructions.md", "utf8");

  // match backticked calls like `npm run dev` or `npm run build:docs`
  const rx = /`npm run ([a-zA-Z0-9:_-]+)`/g;
  const missing = new Set();
  let m;
  while ((m = rx.exec(text))) {
    const name = m[1];
    if (!scripts.has(name)) missing.add(name);
  }

  if (missing.size) {
    console.error(
      "❌ Copilot instructions reference missing npm scripts:\n - " +
        [...missing].join("\n - ")
    );
    process.exit(1);
  } else {
    console.log("✅ Copilot instructions: all referenced scripts exist.");
  }
} catch (err) {
  console.error("❌ validate:copilot failed:", err?.message || err);
  process.exit(1);
}