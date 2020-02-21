import { Command } from "lwcf";

export default class Main extends Command {
  run(argv: string[], flags): void {
    console.log("My super awesome cli!", argv, flags);
  }
}
