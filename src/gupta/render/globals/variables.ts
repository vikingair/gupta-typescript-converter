import { type GlobalDeclarations } from "../../parse/global_declarations";
import { TS_TYPES } from "../shared";

export const renderGlobalVariables = (
  declarations: GlobalDeclarations,
): string =>
  `export {};\ndeclare global {
${declarations.variables
  .map((v) => {
    if ("comment" in v) return v.comment;
    return `  let ${v.name}: ${"type" in v ? TS_TYPES[v.type] : v.className}${v.isArray ? "[]" : ""};`;
  })
  .join("\n")}
}`;
