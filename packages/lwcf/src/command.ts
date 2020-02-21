import * as fs from "fs";
import * as readline from "readline";

import { parse } from "./flags/parser";
import { Flags } from "./flags/flag";

export default abstract class Command {
  /** Name of the command, defaults to name of class */
  static id?: string;

  /** Give description for command */
  static description?: string;

  /** String list of aliases for command. */
  static aliases?: string[];

  /** A object of flags for the command. */
  static flags?: Flags;

  /** List of sub commands. */
  static commands?: typeof Command[];

  /** Set default values for flags. */
  static defaults?: object;

  /**
   * User-defined application code. (called when running application)
   */
  abstract run(args?: string[], flags?: any, globals?: any): void;

  /**
   * User-defined exception handler.
   * Used to override the default error handler (throw error)
   */
  async exception(error: Error): Promise<any> {
    throw error;
  }

  /**
   * Throw an error with exit and error code, making tracing problems easier.
   */
  error(message: string | Error, options?: { code?: string; exit?: number }) {
    // TODO: Implement log handler for logging software like sentry.

    let error: Error;
    if (message instanceof Error) {
      error = message;
    } else {
      error = new Error(message);
    }

    const stack = error.stack.split("\n");
    error.stack = [
      stack[0],
      message instanceof Error ? [stack[1]] : [stack[2]]
    ].join("\n");

    error["code"] = options?.code || "UNKNOWN_ERROR";
    error["exit"] = options?.exit || 1;

    throw error;
  }

  /**
   * Execute another command directly from a separate command.
   *
   * Note: If the flags parameter is used, the command will run directly and
   *       won't parse the args parameter as flags and strings.
   *
   * @param command The command to execute.
   * @param args The arguments passed to the command execution.
   * @param flags The flags provided for the command.
   */
  async execute(
    command: typeof Command,
    args: string[],
    flags?: Flags,
    globals?: Flags
  ) {
    if (flags) {
      const instance = new (command as new () => Command)();
      return await instance.run(args, flags, globals);
    }
    await execute(command, args);
  }
}

export async function execute(executor: typeof Command, argv?: string[]) {
  const { command, flags, args, globals } = parse(executor, argv);

  const instance = new command();

  let exit: number = 0;
  try {
    await instance.run(args, flags, globals || {});
  } catch (err) {
    await instance.exception(err);
    exit = err?.code || 1;
  }

  process.exit(exit);
}
