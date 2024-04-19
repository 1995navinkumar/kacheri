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
const ENV = process.env.ENV ?? "production";
const OUTPUT_DIR = `dist/${MODE}`;
const ASSETS_DIR = `${OUTPUT_DIR}/assets`;

const entryPoints =
  MODE === "web"
    ? ["client/src/main.tsx"]
    : [
        "client/src/main.tsx",
        "client/src/service-worker.ts",
        "client/src/offscreen.ts",
      ];

const buildOptions = {
  entryPoints,
  bundle: true,
  minify: ENV === "production",
  sourcemap: true,
  define: {
    "process.env.MODE": `"${MODE}"`,
    "process.env.ENV": `"${ENV}"`,
  },
  outdir: OUTPUT_DIR,
  logLevel: "info",
};

mkdirSync(OUTPUT_DIR, { recursive: true });

if (ENV === "production") {
  await esbuild.build(buildOptions);
} else {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log(`watching - ${MODE}`);
}

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
  const outStream = createWriteStream(
    `${destinationDir}/kacheri_extension.zip`
  );
  const zipper = archiver("zip");
  zipper.pipe(outStream);

  zipper.directory(sourceDir, false);

  zipper.finalize();
}
