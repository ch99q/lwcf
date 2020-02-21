import { Command, Flags } from "lwcf";

import * as fs from "fs";
import * as dns from "dns";
import * as path from "path";

import * as chalk from "chalk";

import * as prompts from "prompts";

import * as validate from "validate-npm-package-name";

import { yarnAvailable } from "./helpers/manager";

import create from "./create";

export default class Main extends Command {
  static flags: Flags = {
    npm: {
      type: "boolean"
    },
    yarn: {
      type: "boolean"
    },
    example: {
      char: "e",
      type: "string"
    }
  };

  async run(
    argv: string[],
    flags?: {
      npm: boolean;
      yarn: boolean;
      example: string;
    }
  ): Promise<any> {
    try {
      let manager: "npm" | "yarn" = "npm";
      if (flags.npm || flags.yarn) {
        manager = flags.npm ? "npm" : flags.yarn ? "yarn" : "npm";
        if (manager === "yarn" && !yarnAvailable()) {
          throw new Error(
            `You are trying to use ${chalk.red(
              "yarn"
            )}, but was unable to find it in the system.\n\n⎔  Install yarn using: ${chalk.green(
              "npm i -g yarn"
            )}`
          );
        }
      } else if (yarnAvailable()) {
        manager = (
          await prompts({
            type: "select",
            name: "value",
            message: "Choose a package manager?",
            choices: [
              { title: "npm", value: "npm" },
              { title: "yarn", value: "yarn" }
            ]
          })
        ).value;
      }

      let projectPath: string = argv.join("-");

      if (typeof projectPath === "string") {
        projectPath = projectPath.trim();
      }

      if (!projectPath) {
        const result = await prompts({
          type: "text",
          name: "path",
          message: "What is your project named?",
          initial: "my-app",
          validate: name => {
            const validation = validate(path.basename(path.resolve(name)));
            if (validation.validForNewPackages) {
              return true;
            }
            return "Invalid project name: " + validation.errors![0];
          }
        });

        if (typeof result.path === "string") {
          projectPath = result.path.trim();
        }
      }

      const program = path.basename(process.argv[1]);

      if (!projectPath) {
        console.log();
        console.log("Please specify the project directory:");
        console.log(
          `  ${chalk.gray(program)} ${chalk.green("<project-directory>")}`
        );
        console.log();
        console.log("For example:");
        console.log(`  ${chalk.gray(program)} ${chalk.green("my-lwcf-app")}`);
        console.log();
        process.exit(1);
      }

      const rootDir = path.resolve(projectPath);
      const projectName = path.basename(projectPath);

      const validation = validate(projectName);
      if (!validation.validForNewPackages) {
        console.error(
          `${chalk.red("Error:")} Could not create a project called ${chalk.red(
            `"${projectName}"`
          )} because of npm naming restrictions: `
        );
        validation.errors!.forEach(err =>
          console.error(`    ${chalk.red.bold("*")} ${err}`)
        );
        process.exit(1);
      }

      await create({
        root: rootDir,
        name: projectName,
        example: flags.example ? flags.example : undefined,
        settings: {
          manager
        }
      });
    } catch (err) {
      console.error();
      console.error(`${chalk.red("Error:")} ${err.message}`);
      console.error();
      process.exit(1);
    }
  }
}
