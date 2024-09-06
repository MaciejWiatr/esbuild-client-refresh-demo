/** @type {import("esbuild").BuildOptions} */
export default {
  entryPoints: ["src/**/*.ts"],
  outdir: "dist",
  platform: "node",
  outExtension: { ".js": ".js" },
  format: "cjs",
};
