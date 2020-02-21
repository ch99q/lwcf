import { run } from "./helpers/execute";
import { flush } from "./helpers/flush";
import { handle } from "./helpers/handle";

export { default as Command } from "./command";

export { Flags, Flag } from "./flags/flag";

/**
 * Adding support for ES6 / TypeScript import statements for run, flush and handle functions.
 */
export { run, flush, handle };

/**
 * Adding support for CommonJS to require run, flush and handle functions.
 */
export default { run, flush, handle };
