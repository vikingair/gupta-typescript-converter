import {
  type GuptaFunctionSpec,
  type GuptaParams,
  GuptaPrimitive,
} from "../parse/types";
import { renderBodyStatements } from "./body";
import { indent, TS_TYPES } from "./shared";

const INITIAL_VALUE_BY_PRIMITIVE: Record<GuptaPrimitive, string> = {
  [GuptaPrimitive.DATE_TIME]: "DATETIME_Null",
  [GuptaPrimitive.NUMBER]: "NUMBER_Null",
  [GuptaPrimitive.BOOLEAN]: "false",
  [GuptaPrimitive.STRING]: "STRING_Null",
  [GuptaPrimitive.WINDOW_HANDLE]: "Symbol() as any",
  [GuptaPrimitive.SQL_HANDLE]: "Symbol() as any",
  [GuptaPrimitive.FUNCTION]: "(...args: any[]): any => {}",
};

const getInitialValue = ({
  type,
  isArray,
}: {
  type: GuptaPrimitive;
  isArray: boolean;
}) => {
  if (isArray) return "[]";
  return INITIAL_VALUE_BY_PRIMITIVE[type];
};

export const renderVars = (params?: GuptaParams) => {
  if (!params?.length) return "";
  return params
    .map((p) => {
      if ("comment" in p) return `// ${p.comment}`;
      if ("type" in p)
        return `let ${p.name}: ${renderType(p)} = ${getInitialValue(p)};`;
      return `// class: ${p.className}\nlet ${p.name}: any${p.isArray ? "[]" : ""} = Symbol();`;
    })
    .join("\n");
};

export const getParameterNames = (params: GuptaParams): string[] =>
  params.map((s) => ("name" in s ? s.name : undefined)).filter(Boolean);

const renderType = ({
  type,
  isArray,
}: {
  type: GuptaPrimitive;
  isArray: boolean;
}) => `${TS_TYPES[type]}${isArray ? "[]" : ""}`;

export const renderParams = (params: GuptaParams, separator: "," | ";") =>
  params
    .map((p) => {
      if ("comment" in p) return p.comment;
      if ("type" in p) return `${p.name}: ${renderType(p)}${separator}`;
      return `// class: ${p.className}\n${p.name}: any${p.isArray ? "[]" : ""}${separator}`;
    })
    .join("\n");

export const renderMethod = (
  {
    name,
    inlineComment,
    parameters,
    returnType,
    body,
    localVars,
  }: GuptaFunctionSpec,
  globalVars: string[],
  instanceVars: string[],
) => {
  const params = indent(1, renderParams(parameters, ","));
  const functionSignature = `${name}(${params ? `\n${params}\n` : ""})${returnType === "any" ? "" : ": " + TS_TYPES[returnType]} {`;
  return [
    inlineComment,
    functionSignature,
    indent(1, renderVars(localVars)),
    renderBodyStatements(
      body,
      1,
      globalVars
        .concat(getParameterNames(parameters))
        .concat(localVars ? getParameterNames(localVars) : []),
      instanceVars,
    ),
    "}",
  ]
    .filter(Boolean)
    .join("\n");
};

export const renderFunction = (
  {
    name,
    inlineComment,
    parameters,
    returnType,
    body,
    localVars,
  }: GuptaFunctionSpec,
  globalVars: string[],
) => {
  const params = indent(1, renderParams(parameters, ","));
  const functionSignature = `const ${name} = (${params ? `\n${params}\n` : ""})${returnType === "any" ? "" : ": " + TS_TYPES[returnType]} => {`;
  return [
    inlineComment,
    functionSignature,
    indent(1, renderVars(localVars)),
    renderBodyStatements(
      body,
      1,
      globalVars
        .concat(getParameterNames(parameters))
        .concat(localVars ? getParameterNames(localVars) : []),
    ),
    "};",
  ]
    .filter(Boolean)
    .join("\n");
};

export const renderFunctions = (
  specs: GuptaFunctionSpec[],
  globalVars: string[],
) => {
  if (!specs.length) return "";
  return (
    specs.map((spec) => renderFunction(spec, globalVars)).join("\n\n") + "\n\n"
  );
};
