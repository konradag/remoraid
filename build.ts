import type { BuildConfig } from "bun";
import { dts } from "bun-dts";
import { cp } from "fs/promises";
import packageJson from "./package.json";

const packages: string[] = ["core", "server", "jsonforms", "modals"];
type Package = (typeof packages)[number];

const sharedBuildConfig: (
  p?: Package,
  withClientBanner?: boolean
) => Omit<BuildConfig, "entrypoints"> = (p, withClientBanner) => ({
  outdir: `./dist/${p ?? ""}`,
  external: [
    ...Object.keys(packageJson.peerDependencies || {}),
    ...packages.filter((e) => e !== p).map((e) => `remoraid/${e}`),
  ],
  ...(withClientBanner ? { banner: '"use client";' } : undefined),
});
const buildConfigs: { [P in Package]: BuildConfig } = {
  core: {
    ...sharedBuildConfig("core", true),
    entrypoints: ["./src/core/index.ts"],
  },
  server: {
    ...sharedBuildConfig("server"),
    entrypoints: ["./src/server/index.ts"],
  },
  jsonforms: {
    ...sharedBuildConfig("jsonforms", true),
    entrypoints: ["./src/jsonforms/index.ts"],
  },
  modals: {
    ...sharedBuildConfig("modals", true),
    entrypoints: ["./src/modals/index.ts"],
  },
};

await Promise.all([
  ...packages.map((p) =>
    Bun.build({
      ...buildConfigs[p],
      plugins: [dts()],
      format: "esm",
      naming: "[dir]/[name].js",
    })
  ),
  ...packages.map((p) =>
    Bun.build({
      ...buildConfigs[p],
      format: "cjs",
      naming: "[dir]/[name].cjs",
    })
  ),
  cp("./src/core/lib/styles.css", "./dist/core/styles.css"),
]);
