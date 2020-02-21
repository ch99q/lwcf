import * as os from "os";
import * as fs from "fs";
import * as path from "path";

// export const findProjectRoot = (options?: { cwd?: boolean }): string => {
//   return path.dirname(
//     findPackage(
//       options?.cwd
//         ? process.cwd()
//         : path.dirname(
//             require.main?.filename ||
//               process.mainModule?.filename ||
//               path.resolve(process.argv[1], "package.json") ||
//               path.resolve(process.cwd(), "package.json")
//           )
//     )
//   );
// };

export const locateProjectRoot = (): string => {
  return path.dirname(findPackage(process.cwd()));
};

export const findPackage = (dir: string): string => {
  if (fs.existsSync(path.resolve(dir, "package.json"))) {
    return path.resolve(dir, "package.json");
  } else if (
    path.relative(
      dir,
      os.platform() == "win32" ? process.cwd().split(path.sep)[0] : "/"
    ) !== ""
  ) {
    return findPackage(path.resolve(dir, ".."));
  }
};
