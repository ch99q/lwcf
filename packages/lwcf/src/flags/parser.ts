import Command from "../command";

import { Flag } from "./flag";

export interface FlagParserResult {
  command: new () => Command;
  flags: { [name: string]: any };
  globals: { [name: string]: any };
  args: string[];
}

function parseCommand(
  command: typeof Command,
  argv: string[],
  parent?: FlagParserResult
): FlagParserResult {
  let result: FlagParserResult = {
    command: command as new () => Command,
    flags: parent?.flags || {},
    globals: { ...parent?.flags },
    args: []
  };

  let flags: { [name: string]: Flag } = command.flags || {};

  const name = argument =>
    (argument.startsWith("--") ? argument.slice(2) : argument.slice(1)).split(
      "="
    )[0];

  const f = flag =>
    (flags[flag] && flag) ||
    Object.keys(flags).find(f => flags[f].char == flag) ||
    flag;

  while (argv.length > 0) {
    let argument = argv[0];

    // Validate if argument is a flag.
    if (argument.startsWith("-")) {
      // Save the flag name for later.
      let flag = name(argument);
      let value = argument.split("=")[1];

      // Check if the flag is a super flag.
      // Super Flag is when a flag only starts with a single - and contains multiple letters.
      // E.g. 'command -gfh' then it's important to split the flags into bits like ['g', 'f', 'h'] and parse them as individual flags.
      if (!argument.startsWith("--") && argument.length >= 3) {
        argv.shift(); // Remove the flag from the argv array.
        argv.unshift(...flag.split("").map(i => "-" + i)); // Fill the array with the flags from the super flag.
        continue; // Skip the super flag.
      }

      if (flags[f(flag)]?.type === "string" && !result.flags[f(flag)]) {
        // If the value is already found, no reason to look deeper to find it.
        if (value || result.flags[f(flag)]) {
          result.flags[f(flag)] = value;
          continue;
        }

        // Search for the next string in argv, and use result as value.
        let i: number = 0;
        let args = [...argv];
        while (args.shift()?.startsWith("-")) {
          i++;
          result.flags[f(flag)] = args[0];
        }

        // Removes the value, so the parser don't think it's a command or argument later.
        argv.splice(i, 1);
      } else if (flags[f(flag)]?.type === "boolean") {
        // Just some basic conversion of a boolean value. (allowed values: 'false', '0' else true)
        result.flags[f(flag)] =
          value === undefined
            ? true
            : value === "false"
            ? false
            : value === "0"
            ? false
            : true;
      } else if (!result.flags[f(flag)]) {
        result.flags[f(flag)] = true;
      }
    } else {
      const forward = ((argument, command: typeof Command) =>
        command.commands?.find(
          (command: typeof Command) =>
            command.id?.toLowerCase() === argument.toLowerCase() ||
            command.name?.toLowerCase() === argument.toLowerCase() ||
            command.aliases?.includes(argument.toLowerCase())
        ))(argument, command);

      if (forward) {
        argv.shift();
        return parseCommand(forward, argv, result);
      }

      result.args.push(argument);
    }

    argv.shift();
  }

  return result;
}

export function parse(
  command: typeof Command,
  argv: string[]
): FlagParserResult {
  return parseCommand(command, argv);
}
