import { readFileSync, writeFileSync, cpSync, mkdirSync } from "fs";
import * as esbuild from "esbuild";

const MODE = process.env.MODE ?? "web";
const OUTPUT_DIR = `dist/${MODE}`;
const ASSETS_DIR = `${OUTPUT_DIR}/assets`;

await esbuild.build({
  entryPoints: ["client/src/main.tsx"],
  bundle: true,
  minify: true,
  sourcemap: true,
  define: {
    "process.env.MODE": `"${MODE}"`,
  },
  outdir: OUTPUT_DIR,
});

if (MODE === "extension") {
  cpSync("client/src/extension", "dist/extension", { recursive: true });
} else {
  transformHTML("client/index.html", "dist/web/index.html");
}

mkdirSync(ASSETS_DIR, { recursive: true });
cpSync("client/assets", ASSETS_DIR, { recursive: true });

function transformHTML(srcPath, destPath) {
  const htmlContent = readFileSync(srcPath, "utf-8");
  const modifiedContent = htmlContent.replace(
    "$baseHref",
    process.env.BASE ? `${process.env.BASE}/` : "/"
  );
  writeFileSync(destPath, modifiedContent);
}
