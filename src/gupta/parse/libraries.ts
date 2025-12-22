import path from "node:path";
import { getGuptaAst, GuptaAstElemType, type GuptaAstElem } from "../ast";
import { readFile } from "../utils";
import { Context } from "../error";

export type AvailableLibsMap = Map<
  string,
  { name: string; relativeDir: string; dir: string; processed: boolean }
>;
export type Library = {
  name: string;
  relativeDir: string;
  ast: GuptaAstElem;
  ctx: Context;
};

export const getLibraries = async (
  ctx: Context,
  elem: GuptaAstElem,
  availableLibsMap: AvailableLibsMap,
): Promise<Library[]> => {
  if (elem.type !== GuptaAstElemType.OBJECT) {
    ctx.withElem(elem).throw("Cannot get Libraries of wrong ast elem type");
  }

  const allLibIncludes = elem
    .children!.map((c) => {
      if (c.type === GuptaAstElemType.COMMENT) return;
      if (c.type !== GuptaAstElemType.ATTRIBUTE || c.name !== "File Include") {
        return ctx.withElem(c).throw("Unexpected element found in Libraries");
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
      const source = path.join(dir, name);
      const content = await readFile(source);
      const ctx = new Context(source);
      const ast = getGuptaAst(new Context(source), content);
      return { name, relativeDir, ast, ctx };
    }),
  );
};
