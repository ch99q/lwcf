const { Command } = require("lwcf");

class Main extends Command {
  run(argv, flags) {
    console.log("My super awesome cli!", argv, flags);
  }
}

module.exports = Main
