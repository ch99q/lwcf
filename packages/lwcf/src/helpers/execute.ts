import * as path from "path";

/**
 * Import type definitions.
 */
import { CLI, Package } from "../types";

/**
 * Import Package utilities.
 */
import { locateProjectRoot } from "./package";
import {
  isTypeScript,
  registerTypeScript,
  isTypeScriptInstance
} from "./typescript";

import Command, { execute } from "../command";

export async function run(options?: CLI.Options) {
  /**
   * Prevent LWCF to run multiple times, in case the use case includes the bin,
   * to be the same as the main script.
   */
  if (process.env["LWCF"] === "true") return;
  process.env["LWCF"] = "true";

  const rootDir = options?.dir || locateProjectRoot();
  const pkgPath = path.resolve(rootDir, "package.json");

  let pkg: Package;
  try {
    // Require package.json for identification of the main script.
    pkg = require(pkgPath);
  } catch {
    console.error(`Unable to locate package.json at '${pkgPath}'`);
    process.exit(1);
  }

  // Find the main script with focus on build first.
  let script: string = path.resolve(
    rootDir,
    pkg.module || pkg.directories?.lib || pkg.main
  );

  try {
    try {
      if (isTypeScript(rootDir)) {
        // Check if TS-Node is already running process.
        if (isTypeScriptInstance()) {
          // Register TypeScript parser to allowing importing TypeScript files.
          registerTypeScript(rootDir);
        }

        // Find the main script with focus on development first.
        script = path.resolve(
          rootDir,
          pkg.module || pkg.main || pkg.directories?.lib
        );
      }
    } catch (error) {
      // Throw error in case the main script isn't defined in the package.json.
      if (error.code === "ERR_INVALID_ARG_TYPE") {
        throw new Error("Unable to identify executable in '" + pkgPath + "'");
      }
    }

    const req = require(script);

    // Build command from required script. Check for default property for allowance of CommonJS.
    const command: typeof Command = req["default"] ? req.default : req;

    if (typeof command === "object")
      throw new Error("Script '" + script + "' does not export command.");

    // Execute the main command with automatic argument parsing.
    await execute(command, process.argv.slice(2));
  } catch (error) {
    // Throw error in case the script is missing export of the main command.
    if (error.message === "object.default is not a constructor") {
      throw new Error("Script '" + script + "' does not export command.");
    }

    if (error.message === "instance.run is not a function") {
      throw new Error(
        "Command in '" + script + "' does not have a run function."
      );
    }

    throw error;
  }
}
