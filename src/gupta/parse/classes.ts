import {
  type GuptaAstElem,
  GuptaAstElemType,
  type GuptaAttributeElem,
} from "../ast";
import type { Context } from "../error";
import { getEvenHandlerSpec, getFunctionSpec } from "./file";
import { getParameters, getPrimitve } from "./shared";
import {
  type GuptaClassDefSpec,
  type GuptaEventHandlerSpec,
  type GuptaFunctionSpec,
  GuptaPrimitive,
  GuptaSpecType,
} from "./types";

const _parseDerivedFrom = (ctx: Context, c: GuptaAstElem): string[] => {
  const inheritedFrom = [];
  if (c.children?.length) {
    for (const c2 of c.children) {
      if (c2.type === GuptaAstElemType.COMMENT) continue;
      if (c2.type !== GuptaAstElemType.ATTRIBUTE) {
        return ctx
          .withElem(c2)
          .throw("_parseDerivedFrom: expected attribute in 'Derived From'");
      }
      if (c2.name !== "Class") {
        return ctx
          .withElem(c2)
          .throw(
            "_parseDerivedFrom: expected 'Class' attribute in 'Derived From'",
          );
      }
      inheritedFrom.push(String(c2.value));
    }
  }
  return inheritedFrom;
};

const _parseFunctions = (ctx: Context, c: GuptaAstElem): GuptaFunctionSpec[] =>
  (c.children ?? [])
    // TODO: Show comments above function
    .filter((c2) => c2.type !== GuptaAstElemType.COMMENT)
    .map((c2) => {
      if (c2.type !== GuptaAstElemType.FUNCTION) {
        return ctx
          .withElem(c2)
          .throw("_parseFunctions: Unexpected elem type in Functions object");
      }
      return getFunctionSpec(ctx, c2);
    });

const _parseActions = (
  ctx: Context,
  c: GuptaAstElem,
): GuptaEventHandlerSpec[] =>
  (c.children ?? [])
    // TODO: Show comments above function
    .filter((c2) => c2.type !== GuptaAstElemType.COMMENT)
    .map((c2) => {
      if (c2.type !== GuptaAstElemType.ON) {
        return ctx
          .withElem(c2)
          .throw(
            "parseDataFieldClass: Unexpected elem type in Functions object",
          );
      }
      return getEvenHandlerSpec(ctx, c2);
    });

export const parseGenericClass = (
  ctx: Context,
  {
    elem,
    descriptionFromComments,
  }: {
    elem: GuptaAttributeElem;
    descriptionFromComments: string;
  },
): GuptaClassDefSpec => {
  let description = "";
  let inheritedFrom: string[] = [];
  let functions: GuptaClassDefSpec["functions"] = [];
  let instanceVars: GuptaClassDefSpec["instanceVars"] = [];
  let classVars: GuptaClassDefSpec["classVars"] = [];
  let actions: GuptaClassDefSpec["actions"] = [];
  let dataType: GuptaPrimitive | undefined = undefined;
  for (const c of elem.children!) {
    if (c.type === GuptaAstElemType.ATTRIBUTE) {
      switch (c.name) {
        case "Description": {
          description = String(c.value)
            .split("\n")
            .map((l) => "// " + l)
            .join("\n");
          break;
        }
        default: {
          // ignored
        }
      }
    }
    if (c.type === GuptaAstElemType.ARRAY) {
      switch (c.stm) {
        case "Instance Variables": {
          instanceVars = getParameters(ctx, c);
          break;
        }
        case "Class Variables": {
          classVars = getParameters(ctx, c);
          break;
        }
        default: {
          return ctx.withElem(c).throw("parseGenericClass: Unknown array");
        }
      }
    }
    if (c.type === GuptaAstElemType.OBJECT) {
      switch (c.stm) {
        case "Functions": {
          functions = _parseFunctions(ctx, c);
          break;
        }
        case "Derived From": {
          inheritedFrom = _parseDerivedFrom(ctx, c);
          break;
        }
        case "Message Actions": {
          actions = _parseActions(ctx, c);
          break;
        }
        case "Data": {
          const dataTypeElem = (c.children ?? []).find(
            (c2) =>
              c2.type === GuptaAstElemType.ATTRIBUTE && c2.name === "Data Type",
          ) as GuptaAttributeElem | undefined;
          if (!dataTypeElem)
            return ctx
              .withElem(c)
              .throw("parseGenericClass: Could not find 'Data Type'");
          if (dataTypeElem.value === "Class Default") {
            dataType = GuptaPrimitive.TODO;
          } else {
            dataType = getPrimitve(ctx, dataTypeElem.value, dataTypeElem.stm);
          }
          break;
        }
        case "Constructor/Destructor": {
          // TODO
          break;
        }
        case "Ribbon":
        case "Menu":
        case "Tool Bar":
        case "Contents":
          // TODO: From "Form Window Class"
          break;
        case "List Initialization":
          // TODO: From "Combo Box Class"
          break;
        case "List Values":
        case "Cell Options":
          // TODO: From "Column Class"
          break;
        case "Scaling": // from "Picture Class"
        case "Memory Settings": // from "Child Table Class"
        case "Window Location and Size":
        case "Display Settings":
          // ignored
          break;
        default:
          return ctx.withElem(c).throw("parseGenericClass: unexpected object");
      }
    }
  }

  return {
    type: GuptaSpecType.CLASS_DEFINITION,
    description: [descriptionFromComments, description, `// ${elem.name}`]
      .filter(Boolean)
      .join("\n"), // TODO
    inheritedFrom,
    classVars: classVars,
    instanceVars: instanceVars,
    functions,
    actions,
    dataType,
  };
};
