import { type GuptaAstElem, GuptaAstElemType } from "../ast";
import {
  type GuptaFunctionSpec,
  type GuptaParams,
  GuptaPrimitive,
  type GuptaSpec,
  GuptaSpecType,
} from "./types";

const BLACK_LIST_ATTRIBUTES = new Set([
  "Accessories Enabled",
  "XAML Style",
  "Background Brush",
  "Vertical Anchor",
  "Horizontal Anchor",
  "Minimum Width",
  "Minimum Height",
  "Anchor Maximum Width",
  "Anchor Maximum Height",
  "Anchoring Enabled",
  "Property Template",
  "Background Threads",
  "Keyboard Accelerator",
  "Font Name",
  "Font Size",
  "Font Enhancement",
  "Picture Transparent Color",
  "Image Style",
  "Text Color",
  "Background Color",
  "Button Appearance",
  "Image Alignment",
  "Text Alignment",
  "Text Image Relation",
  "Ribbon Bar Enabled",
  "Visible",
  "Flow Direction",
  "Justify",
  "Spell Check",
  "IME Mode",
  "Class Child Ref Key",
  "Class ChildKey",
  "Width Editable",
  "Width",
]);
export const CONFIG = {
  verbose: false,
};

export const renderComment = (elem: GuptaAstElem): string =>
  elem.stm
    .split("\n")
    .filter((l) => l !== "!")
    .map((l) => `${"  ".repeat(elem.level)}// ${l}`)
    .concat(elem.children?.map(renderComment).filter(Boolean) || [])
    .join("\n");

export const renderInlineComment = (elem: GuptaAstElem): string | undefined =>
  elem.inlineComment
    ? elem.inlineComment
        .split("\n")
        .map((l) => `${"  ".repeat(elem.level)}// ${l}`)
        .join("\n") + "\n"
    : undefined;

export const getSpecWithoutChildren = (
  elem: GuptaAstElem,
): GuptaSpec | undefined => {
  // TODO: Maybe handle "RESOURCE" data for "Icon File:" attribute
  if (
    elem.data &&
    !("INHERITPROPS" in elem.data) &&
    !Object.keys(elem.data).some((k) => k.startsWith("RESOURCE"))
  )
    throw new Error(
      `getSpecWithoutChildren: Unhandled data: (${elem.type}) ${elem.stm}`,
    );
  const inlineComment = renderInlineComment(elem);
  switch (elem.type) {
    case GuptaAstElemType.ATTRIBUTE: {
      if (
        !CONFIG.verbose &&
        (BLACK_LIST_ATTRIBUTES.has(elem.name) || elem.value === "")
      )
        return undefined;
      return {
        type: GuptaSpecType.ATTRIBUTE,
        name: elem.name,
        indent: elem.level,
        value: elem.value,
        inlineComment,
      };
    }
    case GuptaAstElemType.BOOLEAN_ATTRIBUTE: {
      if (!CONFIG.verbose && BLACK_LIST_ATTRIBUTES.has(elem.name))
        return undefined;

      return {
        type: GuptaSpecType.BOOLEAN_ATTRIBUTE,
        name: elem.name,
        indent: elem.level,
        value: elem.value,
        inlineComment,
      };
    }
    case GuptaAstElemType.OBJECT:
      if (!CONFIG.verbose) return undefined;
      return {
        type: GuptaSpecType.OBJECT,
        name: elem.stm,
        indent: elem.level,
        props: [],
        inlineComment,
      };
    case GuptaAstElemType.ARRAY:
      if (!CONFIG.verbose) return undefined;
      // TODO
      return {
        type: GuptaSpecType.OBJECT,
        name: elem.stm,
        indent: elem.level,
        props: [],
        inlineComment,
      };
    case GuptaAstElemType.ON: {
      if (!CONFIG.verbose) return undefined;
      return {
        type: GuptaSpecType.EVENT_HANDLER,
        name: elem.stm,
        indent: elem.level,
        body: [],
        inlineComment,
      };
    }
    default:
      throw new Error(
        `Cannot render type without children: (${elem.type}) ${elem.stm}`,
      );
  }
};

export const getPrimitve = (t: string, stm?: string): GuptaPrimitive => {
  // TODO: What does "Receive" mean?
  switch (t.replace(/^Receive /, "")) {
    case "Boolean":
      return GuptaPrimitive.BOOLEAN;
    case "Number":
      return GuptaPrimitive.NUMBER;
    case "Date/Time":
      return GuptaPrimitive.DATE_TIME;
    case "String":
      return GuptaPrimitive.STRING;
    case "Long String":
      // TODO: What does this mean?
      return GuptaPrimitive.STRING;
    case "File Handle":
      // TODO: What does this mean?
      return GuptaPrimitive.STRING;
    case "Sql Handle":
      return GuptaPrimitive.SQL_HANDLE;
    case "Window Handle":
      return GuptaPrimitive.WINDOW_HANDLE;
    case "FunctionalVar":
      return GuptaPrimitive.FUNCTION;
    default:
      throw new Error(`Cannot get primitive of: ${t}. Stm: ${stm}`);
  }
};

export const getParameters = (elem: GuptaAstElem): GuptaParams =>
  elem.children?.map<GuptaFunctionSpec["parameters"][number]>((e) => {
    if (e.type === GuptaAstElemType.COMMENT) {
      return { comment: renderComment(e) };
    }

    if (e.data?.INHERITPROPS) {
      /* TODO: Handle that case */
    }
    if (e.stm.startsWith("FunctionalVar: ")) {
      const m = e.stm.match(/^FunctionalVar: (.+?)(\[.+\])?$/)!;
      const spec = getSpecWithoutChildren(e.children![0]);
      if (spec?.type !== GuptaSpecType.ATTRIBUTE)
        throw new Error("getFunctionSpec: Unexpected FunctionalVar");
      return { name: m[1], className: spec.value, isArray: !!m[2] };
    }

    const m = e.stm.match(/^(.+): (.+?)(\[.+\])?$/);
    if (!m) throw new Error("getFunctionSpec: Unexpected parameter: " + e.stm);

    return {
      name: m[2].trim(),
      type: getPrimitve(m[1], e.stm),
      isArray: !!m[3],
    };
  }) ?? [];
