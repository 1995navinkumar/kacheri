import {
  readFileSync,
  writeFileSync,
  cpSync,
  mkdirSync,
  createWriteStream,
} from "fs";
import * as esbuild from "esbuild";
import archiver from "archiver";

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
  zipExtension("dist/extension", "dist/web/downloads");
} else {
  transformHTML("client/index.html", "dist/web/index.html");
}

mkdirSync(ASSETS_DIR, { recursive: true });
cpSync("client/assets", ASSETS_DIR, { recursive: true });

// utils
function transformHTML(srcPath, destPath) {
  const htmlContent = readFileSync(srcPath, "utf-8");
  const modifiedContent = htmlContent.replace(
    "$baseHref",
    process.env.BASE ? `${process.env.BASE}/` : "/"
  );
  writeFileSync(destPath, modifiedContent);
}

function zipExtension(sourceDir, destinationDir) {
  mkdirSync(destinationDir, { recursive: true });
  const outStream = createWriteStream(`${destinationDir}/kacheri_extension.zip`);
  const zipper = archiver("zip");
  zipper.pipe(outStream);

  zipper.directory(sourceDir, false);

  zipper.finalize();
}
