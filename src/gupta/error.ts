import { pc } from "brocolito";
import path from "node:path";
import { type GuptaAstElem, GuptaAstElemType } from "./ast";

export const _errorConfig = { sourceFile: "" };

export const throwErr = (
  msg: string,
  { elem }: { elem: GuptaAstElem },
): never => {
  // @ts-expect-error This is the easiest way to get the name of the type
  const t = GuptaAstElemType[elem.type];
  throw new Error(
    `${pc.whiteBright(path.relative(process.cwd(), _errorConfig.sourceFile) + ":" + elem.lineNr)} ${pc.red(msg)}

(${pc.yellow(t)}) ${elem.stm}`,
  );
};
