import {
  type GuptaAstElem,
  GuptaAstElemType,
  type GuptaAttributeElem,
} from "../ast";
import { throwErr } from "../error";
import { getEvenHandlerSpec, getFunctionSpec } from "./file";
import { getParameters, getPrimitve } from "./shared";
import {
  GuptaClassType,
  type GuptaDataFieldClassDefSpec,
  type GuptaFunctionalClassDefSpec,
  GuptaPrimitive,
  GuptaSpecType,
} from "./types";

// "Functional Class"
export const parseFunctionalClass = ({
  elem,
  descriptionFromComments,
}: {
  elem: GuptaAstElem;
  descriptionFromComments: string;
}): GuptaFunctionalClassDefSpec => {
  let description = "";
  const inheritedFrom = [];
  let functions: GuptaFunctionalClassDefSpec["functions"] = [];
  let instanceVars: GuptaFunctionalClassDefSpec["instanceVars"] = [];
  let classVars: GuptaFunctionalClassDefSpec["classVars"] = [];
  for (const c of elem.children!) {
    if (c.type === GuptaAstElemType.ATTRIBUTE) {
      if (c.name !== "Description")
        return throwErr("parseFunctionalClass: unexpected attribute", {
          elem: c,
        });

      description = String(c.value)
        .split("\n")
        .map((l) => "// " + l)
        .join("\n");
    }
    if (c.type === GuptaAstElemType.ARRAY) {
      switch (c.stm) {
        case "Instance Variables": {
          instanceVars = getParameters(c);
          break;
        }
        case "Class Variables": {
          classVars = getParameters(c);
          break;
        }
        default: {
          return throwErr("parseFunctionalClass: Unknown array", { elem: c });
        }
      }
    }
    if (c.type === GuptaAstElemType.OBJECT) {
      switch (c.stm) {
        case "Functions": {
          functions = (c.children ?? [])
            // TODO: Show comments above function
            .filter((c2) => c2.type !== GuptaAstElemType.COMMENT)
            .map((c2) => {
              if (c2.type !== GuptaAstElemType.FUNCTION) {
                return throwErr(
                  "parseFunctionalClass: Unexpected elem type in Functions object",
                  { elem: c2 },
                );
              }
              return getFunctionSpec(c2);
            });
          break;
        }
        case "Derived From": {
          if (c.children?.length) {
            for (const c2 of c.children) {
              if (c2.type === GuptaAstElemType.COMMENT) continue;
              if (c2.type !== GuptaAstElemType.ATTRIBUTE) {
                return throwErr(
                  "parseFunctionalClass: expected attribute in 'Derived From'",
                  {
                    elem: c2,
                  },
                );
              }
              if (c2.name !== "Class") {
                return throwErr(
                  "parseFunctionalClass: expected 'Class' attribute in 'Derived From'",
                  {
                    elem: c2,
                  },
                );
              }
              inheritedFrom.push(String(c2.value));
            }
          }
          break;
        }
        case "Constructor/Destructor": {
          // TODO
          break;
        }
        default:
          return throwErr("parseFunctionalClass: unexpected object", {
            elem: c,
          });
      }
    }
  }

  return {
    type: GuptaSpecType.CLASS_DEFINITION,
    classType: GuptaClassType.FUNCTIONAL,
    description: [descriptionFromComments, description]
      .filter(Boolean)
      .join("\n//\n"), // TODO
    inheritedFrom,
    classVars: classVars,
    instanceVars: instanceVars,
    functions,
  };
};

// "Data Field Class"
export const parseDataFieldClass = ({
  elem,
  descriptionFromComments,
}: {
  elem: GuptaAstElem;
  descriptionFromComments: string;
}): GuptaDataFieldClassDefSpec => {
  let dataType: GuptaPrimitive | undefined = undefined;
  const inheritedFrom = [];
  let functions: GuptaDataFieldClassDefSpec["functions"] = [];
  let actions: GuptaDataFieldClassDefSpec["actions"] = [];
  for (const c of elem.children!) {
    if (c.type === GuptaAstElemType.OBJECT) {
      switch (c.stm) {
        case "Data": {
          const dataTypeElem = (c.children ?? []).find(
            (c2) =>
              c2.type === GuptaAstElemType.ATTRIBUTE && c2.name === "Data Type",
          ) as GuptaAttributeElem | undefined;
          if (!dataTypeElem)
            return throwErr("parseDataFieldClass: Could not find 'Data Type'", {
              elem: c,
            });
          if (dataTypeElem.value === "Class Default") {
            dataType = GuptaPrimitive.TODO;
          } else {
            dataType = getPrimitve(dataTypeElem.value, dataTypeElem.stm);
          }
          break;
        }
        case "Functions": {
          functions = (c.children ?? [])
            // TODO: Show comments above function
            .filter((c2) => c2.type !== GuptaAstElemType.COMMENT)
            .map((c2) => {
              if (c2.type !== GuptaAstElemType.FUNCTION) {
                return throwErr(
                  "parseDataFieldClass: Unexpected elem type in Functions object",
                  { elem: c2 },
                );
              }
              return getFunctionSpec(c2);
            });
          break;
        }
        case "Message Actions": {
          actions = (c.children ?? [])
            // TODO: Show comments above function
            .filter((c2) => c2.type !== GuptaAstElemType.COMMENT)
            .map((c2) => {
              if (c2.type !== GuptaAstElemType.ON) {
                return throwErr(
                  "parseDataFieldClass: Unexpected elem type in Functions object",
                  { elem: c2 },
                );
              }
              return getEvenHandlerSpec(c2);
            });
          break;
        }
        case "Derived From": {
          if (c.children?.length) {
            for (const c2 of c.children) {
              if (c2.type === GuptaAstElemType.COMMENT) continue;
              if (c2.type !== GuptaAstElemType.ATTRIBUTE) {
                return throwErr(
                  "parseDataFieldClass: expected attribute in 'Derived From'",
                  {
                    elem: c2,
                  },
                );
              }
              if (c2.name !== "Class") {
                return throwErr(
                  "parseDataFieldClass: expected 'Class' attribute in 'Derived From'",
                  {
                    elem: c2,
                  },
                );
              }
              inheritedFrom.push(String(c2.value));
            }
          }
          break;
        }
        case "Display Settings": {
          // ignored
          break;
        }
        case "Constructor/Destructor": {
          // ignored
          break;
        }
        default:
          return throwErr("parseDataFieldClass: unexpected object", {
            elem: c,
          });
      }
    }
  }
  if (dataType === undefined) {
    return throwErr(
      "parseDataFieldClass: Could not find 'Data Type' at end of parsing",
      {
        elem,
      },
    );
  }

  return {
    type: GuptaSpecType.CLASS_DEFINITION,
    classType: GuptaClassType.DATA_FIELD,
    dataType,
    description: descriptionFromComments,
    inheritedFrom,
    functions,
    actions,
  };
};
