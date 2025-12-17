import path from "node:path";
import { getGuptaAst, GuptaAstElemType, type GuptaAstElem } from "../ast";
import { readFile } from "../utils";

export type AvailableLibsMap = Map<
  string,
  { name: string; relativeDir: string; dir: string; processed: boolean }
>;
export type Library = {
  name: string;
  relativeDir: string;
  ast: GuptaAstElem;
};

export const getLibraries = async (
  elem: GuptaAstElem,
  availableLibsMap: AvailableLibsMap,
): Promise<Library[]> => {
  if (elem.type !== GuptaAstElemType.OBJECT) {
    throw new Error(
      "Cannot get Libraries of wrong ast elem type: " + elem.type,
    );
  }

  const allLibIncludes = elem
    .children!.map((c) => {
      if (c.type === GuptaAstElemType.COMMENT) return;
      if (c.type !== GuptaAstElemType.ATTRIBUTE || c.name !== "File Include") {
        throw new Error(
          `Unexpected element found in Libraries: (${c.type}) ${c.stm}`,
        );
      }
      const al = availableLibsMap.get(c.value.toLowerCase());
      if (!al) {
        // For now we need to ignore missing libs, which cannot be found
        // console.warn(`'File Include' not found: ${c.value}`);
        return;
      }
      if (al.processed) return;
      al.processed = true;
      const { dir, relativeDir } = al;
      return { dir, relativeDir, name: c.value };
    })
    .filter(Boolean);

  return await Array.fromAsync(
    allLibIncludes.map(async ({ dir, relativeDir, name }) => {
      const content = await readFile(path.join(dir, name));
      const ast = getGuptaAst(content);
      return { name, relativeDir, ast };
    }),
  );
};
