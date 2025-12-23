import {
  type GuptaAstElem,
  GuptaAstElemType,
  type GuptaAttributeElem,
} from "../ast";
import type { Context } from "../error";
import { parseGenericClass } from "./classes";
import { getSpec } from "./file";
import { getParameters, getPrimitve, renderComment } from "./shared";
import {
  type GuptaClassDefSpec,
  type GuptaParams,
  GuptaPrimitive,
  type GuptaSpec,
} from "./types";

type ConstParam =
  | { name: string; type: GuptaPrimitive; value: string }
  | { enumName: string; items: string[] }
  | { comment: string };

export type GlobalDeclarations = {
  constants: Record<string, Array<ConstParam>>;
  functions: Array<GuptaSpec>;
  enums: Array<{ name: string; items: string[] }>;
  variables: GuptaParams;
  classes: Record<string, GuptaClassDefSpec>;
};

export const getGlobalDeclarations = (
  ctx: Context,
  elem: GuptaAstElem,
): GlobalDeclarations => {
  const result: GlobalDeclarations = {
    constants: {},
    functions: [],
    variables: [],
    enums: [],
    classes: {},
  };
  for (const c of elem.children!) {
    if (c.type === GuptaAstElemType.COMMENT) {
      // ignoring top level comments
      continue;
    }
    if (c.stm === "Window Defaults") {
      // just containing style information
      continue;
    }
    if (c.stm === "Formats") {
      // just containing formatting information
      continue;
    }
    if (c.stm === "External Functions") {
      // TODO
      continue;
    }
    if (c.stm === "External Assemblies") {
      // TODO
      continue;
    }
    if (c.stm === "Constants") {
      result.constants = Object.fromEntries(
        (c.children || [])
          .map((c2) => {
            if (c2.type !== GuptaAstElemType.OBJECT)
              return ctx
                .withElem(c2)
                .throw("getGlobalDeclarations: unexpected children type");

            if (c2.stm === "Enumerations") {
              const enums = (c2.children || []).map<ConstParam>((c3) => {
                if (c3.type !== GuptaAstElemType.ATTRIBUTE) {
                  return ctx
                    .withElem(c3)
                    .throw(
                      "getGlobalDeclarations: unexpected children type of Enumerations",
                    );
                }

                if (c3.name !== "Enum") {
                  return ctx
                    .withElem(c3)
                    .throw(
                      "getGlobalDeclarations: unexpected attribute type in Enumerations",
                    );
                }

                const items = c3
                  .children!.filter(
                    (c4) =>
                      c4.type === GuptaAstElemType.ATTRIBUTE &&
                      c4.name === "Item",
                  )
                  .map((c4) => (c4 as GuptaAttributeElem).value);

                if (!items.length) {
                  return ctx
                    .withElem(c3)
                    .throw(
                      "getGlobalDeclarations: unexpected empty items in Enumerations",
                    );
                }

                return { enumName: c3.value, items };
              });

              return [c2.stm, enums];
            }

            const params = (c2.children || []).map<ConstParam>((c3) => {
              if (c3.type === GuptaAstElemType.COMMENT)
                return { comment: c3.stm };

              if (c3.type !== GuptaAstElemType.ATTRIBUTE)
                return ctx
                  .withElem(c3)
                  .throw(
                    "getGlobalDeclarations: unexpected param children type",
                  );

              const m = c3.value.match(/^(.+?)\s*=\s*([\s\S]+)$/);
              if (!m)
                return ctx
                  .withElem(c3)
                  .throw("getGlobalDeclarations: cannot parse param children");
              const [, n, v] = m;

              return {
                name: n,
                type: getPrimitve(ctx, c3.name, c3.stm),
                value: v.trim(),
              };
            });

            return [c2.stm, params];
          })
          .filter(([, params]) => params.length),
      );
      continue;
    }
    if (c.stm === "Resources") {
      // TODO
      continue;
    }
    if (c.stm === "Variables") {
      result.variables = getParameters(ctx, c);
      continue;
    }
    if (c.stm === "Internal Functions") {
      result.functions = (c.children || [])
        .map((c) => getSpec(ctx, c))
        .filter(Boolean);
      continue;
    }
    if (c.stm === "Named Exceptions") {
      // TODO
      continue;
    }
    if (c.stm === "Named Toolbars") {
      // TODO
      continue;
    }
    if (c.stm === "Named Menus") {
      // TODO
      continue;
    }
    if (c.stm === "Class Definitions") {
      const comments: Array<GuptaAstElem> = [];
      for (const c2 of c.children || []) {
        if (c2.type === GuptaAstElemType.COMMENT) {
          comments.push(c2);
          continue;
        }
        if (c2.type !== GuptaAstElemType.ATTRIBUTE)
          return ctx
            .withElem(c2)
            .throw(
              "getGlobalDeclarations: Class Definitions: unexpected children type",
            );

        const descriptionFromComments = comments.map(renderComment).join("\n");
        comments.length = 0;

        result.classes[String(c2.value)] = parseGenericClass(ctx, {
          elem: c2,
          descriptionFromComments,
        });
      }

      continue;
    }
    if (c.stm === "Default Classes") {
      // TODO
      continue;
    }
    if (c.stm === "Application Actions") {
      // TODO
      continue;
    }
    ctx.withElem(c).throw("getGlobalDeclarations: Unhandled child stm");
  }

  return result;
};
