import { type GlobalDeclarations } from "../../parse/global_declarations";
import {
  type GuptaClassDefSpec,
  type GuptaEventHandlerSpec,
  type GuptaFunctionSpec,
} from "../../parse/types";
import { renderBodyStatements } from "../body";
import { getParameterNames, renderMethod, renderParams } from "../functions";
import { indent } from "../shared";

const _renderEventHandlers = (
  handlers: GuptaEventHandlerSpec[],
  globalVars: string[],
  instanceVars: string[],
): string =>
  handlers
    .map(
      (spec) => `'${spec.name}'() {
${renderBodyStatements(spec.body, 1, globalVars, instanceVars)}
}`,
    )
    .join("\n\n");

const _renderFunctions = (
  functions: GuptaFunctionSpec[],
  globalVars: string[],
  instanceVars: string[],
): string =>
  functions
    .map((fn) => renderMethod(fn, globalVars, instanceVars))
    .join("\n\n");

const renderClass = (
  name: string,
  spec: GuptaClassDefSpec,
  globalVars: string[],
) => {
  const methodNames = Array.from(
    new Set(spec.functions.map(({ name }) => name)),
  );
  const instanceVars = getParameterNames(spec.instanceVars)
    .concat(getParameterNames(spec.classVars))
    .concat(methodNames);

  const classBody = [
    spec.dataType &&
      renderParams(
        [{ name: "'Data Type'", type: spec.dataType, isArray: false }],
        ";",
      ),
    renderParams(spec.instanceVars, ";"),
    renderParams(spec.classVars, ";"),
    _renderFunctions(spec.functions, globalVars, instanceVars),
    _renderEventHandlers(spec.actions, globalVars, instanceVars),
  ]
    .filter(Boolean)
    .join("\n\n");

  return [
    spec.description,
    `class ${name}${spec.inheritedFrom.length ? ` extends ${spec.inheritedFrom.join(", ")}` : ""} {
${indent(1, classBody)}
}\n\n`,
  ]
    .filter(Boolean)
    .join("\n");
};

export const renderGlobalClasses = (
  declarations: GlobalDeclarations,
): string => {
  let result = `export {};\ndeclare global {\n`;
  const globalVars = getParameterNames(declarations.variables);
  for (const [name, spec] of Object.entries(declarations.classes)) {
    result += renderClass(name, spec, globalVars);
  }
  result += `}\n`;
  return result;
};
