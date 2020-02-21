import * as chalk from "chalk";

import * as fs from "fs";
import * as path from "path";

import * as isOnline from "is-online";

import { App } from "./types";
import { hasExample, downloadExample } from "./helpers/example";
import { install } from "./helpers/install";

export default async function(app: App) {
  if (app.example) {
    const example = await hasExample(app.example);
    if (!example) {
      throw new Error(
        `Could not locate an example named ${chalk.red(
          `"${app.example}"`
        )}. Please check your spelling and try again.`
      );
    }
  }

  if (fs.existsSync(app.root)) {
    throw new Error(
      `Could create a project at ${chalk.red(
        `"${path.relative(process.cwd(), app.root)}"`
      )}, there is already a folder at the location.`
    );
  }

  if (!app.example) {
    const defaultPackage = require("../default/package.json");
    defaultPackage.name = app.name;

    fs.mkdirSync(app.root, { recursive: true });
    fs.writeFileSync(
      path.resolve(app.root, "package.json"),
      JSON.stringify(defaultPackage, null, 4)
    );
    fs.copyFileSync(
      path.resolve(__dirname, "..", "default", "index.js"),
      path.resolve(app.root, "index.js")
    );
    fs.copyFileSync(
      path.resolve(__dirname, "..", "default", "gitignore"),
      path.resolve(app.root, ".gitignore")
    );
  } else {
    console.log(
      `Downloading files for example ${chalk.cyan(
        app.example
      )}. This might take a moment.`
    );
    console.log();
    await downloadExample(app.root, app.example);
    
    // Copy our default `.gitignore` if the application did not provide one
    const ignorePath = path.join(app.root, '.gitignore')
    if (!fs.existsSync(ignorePath)) {
      fs.copyFileSync(
        path.join(__dirname, '..', 'default', 'gitignore'),
        ignorePath
      )
    }
    
    const defaultPackage = require(path.resolve(app.root, "package.json"));
    defaultPackage.name = app.name;

    fs.writeFileSync(
      path.resolve(app.root, "package.json"),
      JSON.stringify(defaultPackage, null, 4)
    );
  }

  console.log("Installing packages. This might take a couple of minutes.");
  console.log();

  const online: boolean = await isOnline();

  await install(app.root, null, {
    useYarn: app.settings.manager === "yarn",
    isOnline: online
  });

  const program = path.basename(process.argv[1]);

  console.log(`${chalk.green('Success!')} Created ${app.name} at ${app.root}`)
  console.log('Inside that directory, you can run several commands:')
  console.log()
  console.log(chalk.cyan(`  node .`))
  console.log('    Runs the cli app.')
  console.log()
  console.log(chalk.cyan(`  ts-node .`))
  console.log('    Runs the cli app using TypeScript. (if project is based on TypeScript)')
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(chalk.cyan('  cd'), path.relative(process.cwd(), app.root))
  console.log()
}
