/** @type {import("@reactgjs/gest/config").ConfigGetter} */
const getConfig = () => {
  return {
    $schema:
      "node_modules/@reactgjs/gest/dist/gest-config.schema.json",
    testDir: "./__tests__",
    srcDir: "./src",
    setup: "./__tests__/main.setup.mjs",
  };
};

export default getConfig;
