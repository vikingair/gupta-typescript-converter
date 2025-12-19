import {
  type GuptaAstElem,
  GuptaAstElemType,
  type GuptaAttributeElem,
} from "../ast";
import { throwErr } from "../error";
import { parseDataFieldClass, parseFunctionalClass } from "./classes";
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
              return throwErr(
                "getGlobalDeclarations: unexpected children type",
                { elem: c2 },
              );

            if (c2.stm === "Enumerations") {
              const enums = (c2.children || []).map<ConstParam>((c3) => {
                if (c3.type !== GuptaAstElemType.ATTRIBUTE) {
                  return throwErr(
                    "getGlobalDeclarations: unexpected children type of Enumerations",
                    {
                      elem: c3,
                    },
                  );
                }

                if (c3.name !== "Enum") {
                  return throwErr(
                    "getGlobalDeclarations: unexpected attribute type in Enumerations",
                    {
                      elem: c3,
                    },
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
                  return throwErr(
                    "getGlobalDeclarations: unexpected empty items in Enumerations",
                    {
                      elem: c3,
                    },
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
                return throwErr(
                  "getGlobalDeclarations: unexpected param children type",
                  {
                    elem: c3,
                  },
                );

              const m = c3.value.match(/^(.+?)\s*=\s*([\s\S]+)$/);
              if (!m)
                return throwErr(
                  "getGlobalDeclarations: cannot parse param children",
                  {
                    elem: c3,
                  },
                );
              const [, n, v] = m;

              return {
                name: n,
                type: getPrimitve(c3.name, c3.stm),
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
      result.variables = getParameters(c);
      continue;
    }
    if (c.stm === "Internal Functions") {
      result.functions = (c.children || []).map(getSpec).filter(Boolean);
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
          return throwErr(
            "getGlobalDeclarations: Class Definitions: unexpected children type",
            { elem: c2 },
          );

        const descriptionFromComments = comments.map(renderComment).join("\n");
        comments.length = 0;

        if (c2.name === "Form Window Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Column Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Check Box Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Combo Box Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Data Field Class") {
          result.classes[String(c2.value)] = parseDataFieldClass({
            elem: c2,
            descriptionFromComments,
          });
          continue;
        }

        if (c2.name === "Pushbutton Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "General Window Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Background Text Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Child Table Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Dialog Box Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "MDI Window Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Option Button Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Table Window Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Child Grid Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "List Box Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Radio Button Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Picture Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Custom Control Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name === "Frame Class") {
          // TODO: Handle them as well
          continue;
        }

        if (c2.name !== "Functional Class") {
          return throwErr(
            "getGlobalDeclarations: Class Definitions: unexpected attribute name",
            { elem: c2 },
          );
        }

        result.classes[String(c2.value)] = parseFunctionalClass({
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
    throw new Error("getGlobalDeclarations: Unhandled child stm: " + c.stm);
  }

  return result;
};
