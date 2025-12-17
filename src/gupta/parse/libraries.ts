import type { GuptaObjectSpec } from "./types";
import fs from "node:fs/promises";
import path from "node:path";

export const parseLibraries = async (
  projectRootDir: string,
  spec: GuptaObjectSpec,
) => {
  const allAvailableLibs = await Array.fromAsync(
    fs.glob(path.join("{LCL,ShareableFiles}", "*.apl"), {
      cwd: projectRootDir,
    }),
  );
  const allAvailableLibsMap = new Map(
    allAvailableLibs.map((lib) => {
      const [dir, name] = lib.split(path.sep);
      return [name, dir];
    }),
  );

  const allLibIncludes = spec.props
    .map((p) => {
      if (p.type === 0 && p.name === "File Include") {
        if (!allAvailableLibsMap.has(p.value)) {
          throw new Error(`'File Include' not found: ${p.value}`);
        }
        return { dir: allAvailableLibsMap.get(p.value)!, name: p.value };
      }
      return undefined;
    })
    .filter(Boolean);

  return allLibIncludes;
};
