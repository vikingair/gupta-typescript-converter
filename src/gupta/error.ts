import { pc } from "brocolito";
import path from "node:path";
import { type GuptaAstElem, GuptaAstElemType } from "./ast";

export class Context {
  source: string;
  elem?: GuptaAstElem;

  constructor(sourceFile: string) {
    this.source = path.relative(process.cwd(), path.resolve(sourceFile));
  }

  withElem(elem: GuptaAstElem) {
    this.elem = elem;
    return this;
  }

  throw(msg: string): never {
    if (!this.elem) {
      throw new Error(`${pc.whiteBright(this.source)} ${pc.red(msg)}`);
    } else {
      console.log(this.elem);
      // @ts-expect-error This is the easiest way to get the name of the type
      const t = GuptaAstElemType[this.elem.type];
      throw new Error(
        `${pc.whiteBright(this.source + ":" + this.elem.lineNr)} ${pc.red(msg)}

(${pc.yellow(t)}) ${this.elem.stm}`,
      );
    }
  }
}
