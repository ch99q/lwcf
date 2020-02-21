import * as os from "os";
import * as fs from "fs";
import * as path from "path";

export const locateProjectRoot = (): string => {
  return path.dirname(
    findPackage(
      require.main?.filename ||
        process.mainModule?.filename ||
        path.resolve(process.argv[1], "package.json") ||
        path.resolve(process.cwd(), "package.json")
    )
  );
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
