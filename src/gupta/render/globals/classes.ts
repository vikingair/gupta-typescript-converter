import { type GlobalDeclarations } from "../../parse/global_declarations";
import {
  GuptaClassType,
  type GuptaDataFieldClassDefSpec,
  type GuptaFunctionalClassDefSpec,
} from "../../parse/types";
import { getParameterNames, renderMethod, renderParams } from "../functions";
import { indent } from "../shared";

const renderFunctionalClass = (
  name: string,
  spec: GuptaFunctionalClassDefSpec,
  globalVars: string[],
) => {
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

  return [
    spec.description,
    "// Functional Class",
    `class ${name}${spec.inheritedFrom.length ? ` extends ${spec.inheritedFrom.join(", ")}` : ""} {
${indent(1, classBody)}
}\n\n`,
  ]
    .filter(Boolean)
    .join("\n");
};

const renderDataFieldClass = (
  name: string,
  spec: GuptaDataFieldClassDefSpec,
  globalVars: string[],
) => {
  const methodNames = Array.from(
    new Set(spec.functions.map(({ name }) => name)),
  );

  const classBody = [
    renderParams(
      [{ name: "'Data Type'", type: spec.dataType, isArray: false }],
      ";",
    ),
    spec.functions
      .map((fn) => renderMethod(fn, globalVars, methodNames))
      .join("\n\n"),
  ]
    .filter(Boolean)
    .join("\n\n");

  return [
    spec.description,
    "// Data Field Class",
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
    switch (spec.classType) {
      case GuptaClassType.FUNCTIONAL: {
        result += renderFunctionalClass(name, spec, globalVars);
        break;
      }
      case GuptaClassType.DATA_FIELD: {
        result += renderDataFieldClass(name, spec, globalVars);
        break;
      }
      default: {
        // @ts-expect-error We should have checked for all existing classTypes here.
        throw new Error("Received unhandled classType: " + spec.classType);
      }
    }
  }
  result += `}\n`;
  return result;
};
