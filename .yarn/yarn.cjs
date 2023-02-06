#!/usr/bin/env node

/**
 * This script works as a proxy to the real Yarn script file.
 *
 * It will look up the currently used yarn release (as specified in
 * the `.yarnrc.yml` file, or one of the scripts in the
 * `.yarn/releases` folder) and execute it.
 *
 * This makes it easier to update the Yarn version down the line, as
 * we don't need to update each workflow depending on the Yarn along
 * with it.
 */

const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const args = process.argv.slice(2);

const yarnrc = fs.readFileSync(
  path.join(__dirname, "..", ".yarnrc.yml"),
  "utf8"
);

let yarnPath = "";

for (const line of yarnrc.split("\n")) {
  if (line.startsWith("yarnPath: ")) {
    yarnPath = line.replace("yarnPath: ", "");
    break;
  }
}

if (yarnPath === "") {
  const releases = fs.readdirSync(path.join(__dirname, "releases"));
  const latest = releases
    .filter((release) => release.startsWith("yarn-"))
    .sort()
    .pop();

  if (latest) {
    yarnPath = path.join(__dirname, "releases", latest);
  }
}

if (yarnPath === "") {
  console.error("Could not find the yarn script file.");
  process.exit(1);
}

childProcess.spawnSync("node", [yarnPath, ...args], {
  stdio: "inherit",
});
