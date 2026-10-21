import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => fs.readFileSync(path.join(here, "src", name), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(here, "package.json"), "utf8"));

const css = read("styles.css");
const chunks = ["prelude.js", "afc.js", "model.js", "ui-icons.js", "ui-parts.js", "ui-nodes.js", "ui-inspector.js", "ui-page.js", "apply.js"].map((name) => {
  const source = read(name);
  if (/^\s*import\s/m.test(source) || /^\s*export\s/m.test(source)) {
    throw new Error(`src/${name}: chunks run inside the module factory; no import/export`);
  }
  return `// ---- src/${name} ----\n${source.trim()}\n`;
});

const out = `window.__ModuleLoader__.load({
  id: ${JSON.stringify(pkg.name)},
  factory(require) {
    "use strict";
    const CSS = ${JSON.stringify(css)};
${chunks.join("\n")}
    return { inject, apply };
  },
});
`;
fs.writeFileSync(path.join(here, "client.js"), out);
console.log(`client.js: ${out.length} bytes, ${out.split("\n").length} lines`);
