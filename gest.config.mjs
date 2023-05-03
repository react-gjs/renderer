export default () => {
  /** @type {import("@reactgjs/gest/config").Config} */
  const config = {
    $schema: "node_modules/@reactgjs/gest/dist/gest-config.schema.json",
    testDir: "./__tests__",
    srcDir: "./src",
    setup: "./__tests__/main.setup.mjs",
  };

  return config;
};
