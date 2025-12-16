import { type GlobalDeclarations } from "../../parse/global_declarations";
import { getParameterNames, renderMethod, renderParams } from "../functions";
import { indent } from "../shared";

export const renderGlobalClasses = (
  declarations: GlobalDeclarations,
): string => {
  let result = `export {};\ndeclare global {\n`;
  const globalVars = getParameterNames(declarations.variables);
  for (const [name, spec] of Object.entries(declarations.classes)) {
    if (spec.description) {
      result += spec.description + "\n";
    }
    const methodNames = Array.from(
      new Set(spec.functions.map(({ name }) => name)),
    );
    const instanceVars = getParameterNames(spec.instanceVars)
      .concat(getParameterNames(spec.classVars))
      .concat(methodNames);

    const classBody = [
      renderParams(spec.instanceVars, ";"),
      renderParams(spec.classVars, ";"),
      spec.functions
        .map((fn) => renderMethod(fn, globalVars, instanceVars))
        .join("\n\n"),
    ]
      .filter(Boolean)
      .join("\n\n");
    result += `class ${name}${spec.inheritedFrom.length ? ` extends ${spec.inheritedFrom.join(", ")}` : ""} {
${indent(1, classBody)}
}\n\n`;
  }
  result += `}\n`;
  return result;
};
