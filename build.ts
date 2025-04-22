import type { BuildConfig } from "bun";
import dts from "bun-plugin-dts";
import { cp } from "fs/promises";
import pkg from "./package.json";

const sharedBuildConfig: Omit<BuildConfig, "entrypoints"> = {
  outdir: "./dist",
  external: Object.keys(pkg.peerDependencies || {}),
};
const clientBuildConfig: BuildConfig = {
  ...sharedBuildConfig,
  entrypoints: ["./src/index.ts"],
  banner: '"use client";',
};
const sscBuildConfig: BuildConfig = {
  ...sharedBuildConfig,
  entrypoints: ["./src/ssc.ts"],
};

await Promise.all([
  Bun.build({
    ...clientBuildConfig,
    plugins: [dts()],
    format: "esm",
    naming: "[dir]/[name].js",
  }),
  Bun.build({
    ...clientBuildConfig,
    format: "cjs",
    naming: "[dir]/[name].cjs",
  }),
  Bun.build({
    ...sscBuildConfig,
    plugins: [dts()],
    format: "esm",
    naming: "[dir]/[name].js",
  }),
  Bun.build({
    ...sscBuildConfig,
    format: "cjs",
    naming: "[dir]/[name].cjs",
  }),
  cp("src/styles.css", "dist/styles.css"),
]);
