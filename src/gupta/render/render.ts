import { type GuptaAstElem } from "../ast";
import { type GlobalDeclarations } from "../parse/global_declarations";
import {
  type GuptaFile,
  type GuptaSpec,
  GuptaSpecType,
  type GuptaWindowVarsSpec,
} from "../parse/types";
import { renderBodyStatements } from "./body";
import { getParameterNames, renderFunctions } from "./functions";
import { renderHandles } from "./handles";
import { type GuptaFileContents, indent, TS_TYPES } from "./shared";

const renderData = (data: GuptaAstElem["data"]): string => {
  if (!data) return "";

  return `export const data = {
  ${Object.entries(data)
    .map(([name, content]) => `"${name}": \`${content}\``)
    .join(",\n  ")},
};
`;
};

const buildFileContents = (
  spec: GuptaSpec,
  contents: GuptaFileContents,
): void => {
  switch (spec.type) {
    case GuptaSpecType.COMMENT:
      contents.comments.push(spec);
      break;
    case GuptaSpecType.OBJECT: {
      if (spec.clazz) {
        const clazz = spec.clazz.replace(/ /g, "_");
        contents.specs[clazz] ??= [];
        contents.specs[clazz].push({ ...spec, clazz: undefined });
      }
      spec.props.forEach((s) => buildFileContents(s, contents));
      break;
    }
    case GuptaSpecType.POPUP_MENU:
      contents.specs.Popup_Menu ??= [];
      contents.specs.Popup_Menu.push(spec);
      break;
    case GuptaSpecType.FUNCTION:
      contents.functions.push(spec);
      break;
    case GuptaSpecType.WINDOW_VARS:
      contents.windowVars.specs.push(spec);
      contents.windowVars.names.push(...getParameterNames(spec.vars));
      break;
    case GuptaSpecType.EVENT_HANDLER:
    case GuptaSpecType.ATTRIBUTE:
    case GuptaSpecType.BOOLEAN_ATTRIBUTE:
      break;
    default:
      // @ts-expect-error spec.type should be of type never
      throw new Error("buildFileContents: unhandled spec.type: " + spec.type);
  }
};

const renderPropName = (name: string): string => {
  if (/^[a-z_]+$/i.test(name)) return name;
  if (name.includes('"')) return `[\`${name}\`]`;
  return `"${name}"`;
};

const _renderSpec = (
  spec: GuptaSpec,
  level: number,
  availableVarNames: string[],
  nested: boolean,
): string => {
  switch (spec.type) {
    case GuptaSpecType.COMMENT:
      return spec.content;
    case GuptaSpecType.OBJECT: {
      if (spec.clazz) {
        const clazz = spec.clazz.replace(/ /g, "_");
        return `${renderPropName(spec.name)}: ${clazz}.${spec.name},`;
      }
      return `${renderPropName(spec.name)}: {\n${spec.props.map((s) => renderSpec(s, level + 1, availableVarNames, true)).join("\n")}\n${indent(level)}},`;
    }
    case GuptaSpecType.POPUP_MENU:
      return nested
        ? `${renderPropName("Popup Menu: " + spec.name)}: Popup_Menu.${spec.name},`
        : `${renderPropName(spec.name)}: "TODO POPUP_MENU",`;
    case GuptaSpecType.FUNCTION:
      return `${renderPropName("Function: " + spec.name)}: ${spec.name},`;
    case GuptaSpecType.EVENT_HANDLER: {
      const i = indent(level);
      return `${renderPropName(spec.name)}: () => {
${renderBodyStatements(spec.body, level + 1, availableVarNames)}\n${i}},`;
    }
    case GuptaSpecType.ATTRIBUTE:
      return `${renderPropName(spec.name)}: \`${spec.value}\`,`;
    case GuptaSpecType.BOOLEAN_ATTRIBUTE:
      return `${renderPropName(spec.name)}: ${spec.value},`;
    case GuptaSpecType.WINDOW_VARS:
      return "";
    default:
      // @ts-expect-error spec.type should be of type never
      throw new Error("renderSpec: unhandled spec.type: " + spec.type);
  }
};

const renderSpec = (
  spec: GuptaSpec,
  level: number,
  availableVarNames: string[],
  nested = false,
) => indent(level) + _renderSpec(spec, level, availableVarNames, nested);

const renderWindowVars = (specs: GuptaWindowVarsSpec[]) => {
  if (!specs.length) return "";
  return (
    specs
      .flatMap(({ vars }) =>
        vars.map((p) => {
          if ("comment" in p) return `// ${p.comment}`;
          if ("type" in p) return `let ${p.name}: ${TS_TYPES[p.type]};`;
          return `// class: ${p.className}\nlet ${p.name}: any;`;
        }),
      )
      .join("\n") + "\n\n"
  );
};

export const renderGuptaFile = (
  file: GuptaFile,
  declarations: GlobalDeclarations,
) => {
  const contents: GuptaFileContents = {
    data: file.data,
    specs: {},
    comments: [],
    windowVars: {
      specs: [],
      names: Object.values(declarations.constants)
        .flatMap((v) => v.filter((c) => "name" in c).map(({ name }) => name))
        .concat(getParameterNames(declarations.variables)),
    },
    functions: [],
  };
  buildFileContents(file.spec, contents);

  return (
    renderWindowVars(contents.windowVars.specs) +
    renderHandles(contents) +
    renderFunctions(contents.functions, contents.windowVars.names) +
    Object.entries(contents.specs)
      .toReversed()
      .map(
        ([clazz, specs]) => `export const ${clazz} = {
${specs.map((s) => renderSpec(s, 1, contents.windowVars.names)).join("\n")}
};`,
      )
      .join("\n\n") +
    (contents.data ? `\n\n${renderData(contents.data)}` : "")
  );
};
