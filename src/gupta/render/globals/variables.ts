import { type GlobalDeclarations } from "../../parse/global_declarations";
import { TS_TYPES } from "../shared";

export const renderGlobalVariables = (
  declarations: GlobalDeclarations,
): string =>
  declarations.variables
    .map((v) => {
      if ("comment" in v) return v.comment;
      if ("type" in v)
        return `declare let ${v.name}: ${TS_TYPES[v.type]}${v.isArray ? "[]" : ""};`;
      return `// class: ${v.className}\ndeclare let ${v.name}: any${v.isArray ? "[]" : ""};`;
    })
    .join("\n");
