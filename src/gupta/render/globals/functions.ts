import { type GlobalDeclarations } from "../../parse/global_declarations";
import { GuptaSpecType } from "../../parse/types";
import { renderFunction } from "../functions";
import { indent } from "../shared";
import { renderGlobalIncludes } from "./include";

export const renderGlobalFunctions = (
  declarations: GlobalDeclarations,
): string => {
  let result = renderGlobalIncludes(declarations, ".");

  result += `declare global {
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
        throw new Error(
          `renderGlobalFunctions: unexpected function spec type: (${spec.type})`,
        );
    }
  }
  return result;
};
