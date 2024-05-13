import esbuild from "esbuild";
import path from "path";

const __dirname = new URL(".", import.meta.url).pathname;
const p = (...pathSegments) => path.resolve(__dirname, "..", ...pathSegments);

async function build() {
  await esbuild.build({
    target: "es2023",
    entryPoints: [p("src/index.ts")],
    bundle: true,
    platform: "node",
    format: "esm",
    outfile: p("dist/index.js"),
    sourcemap: true,
    external: ["system", "react", "react-reconciler", "dilswer"],
    plugins: [
      {
        name: "externals",
        setup(build) {
          build.onResolve({ filter: /^gi:\/\/.+$/ }, (args) => {
            return { path: args.path, external: true };
          });
        },
      },
    ],
  });
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
