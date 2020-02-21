#!/usr/bin/env node

const { default: lwcf, Command } = require("lwcf");

class Main extends Command {
  run(argv, flags) {
    console.log("My super awesome cli!", argv, flags);
  }
}

module.exports = Main

lwcf
  .run({})
  .then(lwcf.flush)
  .catch(lwcf.handle);
