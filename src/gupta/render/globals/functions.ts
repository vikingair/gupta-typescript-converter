import type { Context } from "../../error";
import { type GlobalDeclarations } from "../../parse/global_declarations";
import { GuptaSpecType } from "../../parse/types";
import { renderFunction } from "../functions";
import { indent } from "../shared";

export const renderGlobalFunctions = (
  ctx: Context,
  declarations: GlobalDeclarations,
): string => {
  let result = `export {};\ndeclare global {
${indent(
  1,
  declarations.functions
    .filter((spec) => "name" in spec)
    .map(({ name }) => `var ${name}: typeof ${name}Impl;`)
    .join("\n"),
)}
}

`;
  for (const spec of declarations.functions) {
    switch (spec.type) {
      case GuptaSpecType.COMMENT:
        result += spec.content + "\n";
        break;
      case GuptaSpecType.FUNCTION: {
        result +=
          renderFunction({ ...spec, name: spec.name + "Impl" }, []) + "\n\n";
        break;
      }
      default:
        ctx.throw(
          `renderGlobalFunctions: unexpected function spec type: (${spec.type})`,
        );
    }
  }
  return result;
};
