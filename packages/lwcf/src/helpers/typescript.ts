import * as fs from "fs";
import * as path from "path";
import * as TSNode from "ts-node";
import { TypeScript } from "../types";

export function isTypeScript(rootDir: string): boolean {
  try {
    if (fs.existsSync(path.resolve(rootDir, "tsconfig.json"))) return true;
  } catch {
    return false;
  }
  return false;
}

export function isTypeScriptInstance(): boolean {
  return (
    typeof process[Symbol.for("ts-node.register.instance")] === "undefined"
  );
}

export function registerTypeScript(rootDir: string): boolean {
  let typescript: typeof import("typescript") | undefined;
  try {
    typescript = require("typescript");
  } catch {
    try {
      typescript = require(rootDir + "/node_modules/typescript");
    } catch {}
  }

  const tsnodePath = require.resolve("ts-node", {
    paths: [rootDir, __dirname]
  });
  const tsnode: typeof TSNode = require(tsnodePath);

  const configPath = path.resolve(rootDir, "tsconfig.json");
  const config: TypeScript.Options = typescript.parseConfigFileTextToJson(
    configPath,
    fs.readFileSync(configPath, "utf8")
  ).config;

  const cwd = process.cwd();

  try {
    process.chdir(rootDir);
    tsnode.register({
      skipProject: true,
      transpileOnly: true,
      compilerOptions: Object.assign(config.compilerOptions, {
        esModuleInterop: config.compilerOptions.esModuleInterop,
        target: config.compilerOptions.target || "es2017",
        module: "commonjs",
        sourceMap: true,
        typeRoots: [`${rootDir}/node_modules/@types`]
      })
    });
  } finally {
    process.chdir(cwd);
  }

  return false;
}
