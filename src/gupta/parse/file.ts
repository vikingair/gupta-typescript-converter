import path from "node:path";
import {
  type GuptaAstElem,
  GuptaAstElemType,
  type GuptaAttributeElem,
  type GuptaFunctionElem,
  type GuptaOnElem,
} from "../ast";
import {
  getGlobalDeclarations,
  type GlobalDeclarations,
} from "./global_declarations";
import { getLibraries, type AvailableLibsMap } from "./libraries";
import {
  CONFIG,
  getParameters,
  getPrimitve,
  getSpecWithoutChildren,
  renderComment,
  renderInlineComment,
} from "./shared";
import {
  type GuptaBaseSpec,
  type GuptaBodyStatement,
  type GuptaEventHandlerSpec,
  type GuptaFile,
  type GuptaFunctionSpec,
  type GuptaIfStatement,
  type GuptaPopupMenuSpec,
  type GuptaSpec,
  GuptaSpecType,
  GuptaStatment,
  type GuptaSwitchStatement,
} from "./types";
import type { Context } from "../error";

const BLACK_LIST_OBJECTS = new Set([
  "Display Settings",
  "Window Location and Size",
]);

// TODO: Replace the "Late Bound" operator ".." correctly as "/*GT1:late bound*/this."
// including especially the transformation of string templates from Gupta to TypeScript
// :foo_bar -> ${foo_bar}
// :arr[entry] -> ${arr[entry]}
// :foo.bar -> ${foo.bar}
export const sanitizeStatement = (str: string) => {
  let quote = "";
  let templateVar = "";
  let templateBracketOpen = false;
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === quote) {
      // found closing quote
      if (templateVar) {
        result += "${" + templateVar + "}";
        templateVar = "";
      }
      result += "`";
      quote = "";
    } else if (quote) {
      // currently inside a string (template)
      if (templateVar) {
        if (templateBracketOpen) {
          templateVar += c;
          if (c === "]") {
            templateBracketOpen = false;
          }
        } else if (c === "[") {
          templateVar += c;
          templateBracketOpen = true;
        } else if (/[a-z0-9_.]/i.test(c)) {
          templateVar += c;
        } else {
          result += "${" + templateVar + "}" + c;
          templateVar = "";
        }
      } else if (
        c === ":" &&
        /[a-z]/i.test(str[i + 1]) &&
        /^[^a-z0-9_[\]]*$/i.test(str[i - 1])
      ) {
        // found start of a template var inside a string
        templateVar = str[i + 1];
        i++;
      } else {
        result += c;
      }
    } else if (c === "'" || c === '"') {
      // found start of quote
      result += "`";
      quote = c;
    } else if (c === "|" && str[i + 1] === "|") {
      // string concatination
      result += "+";
      i++;
    } else if (c === "=") {
      // migrating comparison syntax
      const prevChar = str[i - 1];
      if (prevChar === ">" || prevChar === "<") {
        // ">=" and "<=" stays the same
        result += "=";
      } else if (prevChar === "!") {
        // "!=" -> "!=="
        result += "==";
      } else {
        // "=" -> "==="
        result += "===";
      }
    } else if (
      // .. -> /*GT1:late bound*/this.
      // .. -> /*GT2:late bound*/.
      c.toLowerCase() === "." &&
      str[i + 1]?.toLowerCase() === "." &&
      /[a-z0-9_]/i.test(str[i + 2] ?? "")
    ) {
      if (/[a-z0-9_\])]/i.test(str[i - 1] ?? "")) {
        result += "/*GT2:late bound*/.";
      } else {
        result += "/*GT1:late bound*/this.";
      }
      i++;
    } else if (
      // OR -> ||
      c.toLowerCase() === "o" &&
      str[i + 1]?.toLowerCase() === "r" &&
      !/[a-z0-9_[\].]/i.test((str[i - 1] ?? "") + (str[i + 2] ?? ""))
    ) {
      result += "||";
      i++;
    } else if (
      // AND -> &&
      c.toLowerCase() === "a" &&
      str[i + 1]?.toLowerCase() === "n" &&
      str[i + 2]?.toLowerCase() === "d" &&
      !/[a-z0-9_[\].]/i.test((str[i - 1] ?? "") + (str[i + 3] ?? ""))
    ) {
      result += "&&";
      i++;
      i++;
    } else {
      result += c;
    }
  }
  return result;
};

// TODO: Missing:
// NOT <= -> >
// NOT < -> >=
// NOT >= -> <
// NOT > -> <=
export const sanitizeCondition = (cond: string) =>
  sanitizeStatement(cond)
    // NOT === -> !==
    .replace(/([^a-z0-9_])not\s([^=(]+\s?)===/gi, "$1$2!==")
    .replace(/^not\s([^=]+\s?)===/gi, "$1!==")
    // NOT -> !
    .replace(/([^a-z0-9_])not\s/gi, "$1!")
    .replace(/^not\s/gi, "!");

export const getBodyStatements = (
  ctx: Context,
  elem: GuptaAstElem,
): GuptaBodyStatement[] => {
  const stms: GuptaBodyStatement[] = [];
  let lastIf: GuptaIfStatement | undefined = undefined;
  if (elem.inlineComment)
    stms.push({ type: GuptaStatment.COMMENT, content: elem.inlineComment });

  for (const c of elem.children || []) {
    if (c.inlineComment)
      stms.push({ type: GuptaStatment.COMMENT, content: c.inlineComment });

    switch (c.type) {
      case GuptaAstElemType.COMMENT: {
        stms.push({ type: GuptaStatment.COMMENT, content: renderComment(c) });
        break;
      }
      case GuptaAstElemType.IF: {
        lastIf = {
          type: GuptaStatment.IF,
          condition: sanitizeCondition(c.condition),
          elseIf: [],
          body: getBodyStatements(ctx, c),
        };
        stms.push(lastIf);
        break;
      }
      case GuptaAstElemType.ELSE_IF: {
        if (!lastIf)
          return ctx
            .withElem(c)
            .throw("getBodyStatements: missing if for else-if");
        lastIf.elseIf.push({
          condition: sanitizeCondition(c.condition),
          body: getBodyStatements(ctx, c),
        });
        break;
      }
      case GuptaAstElemType.ELSE: {
        if (!lastIf)
          return ctx
            .withElem(c)
            .throw("getBodyStatements: missing if for else");
        lastIf.else = { body: getBodyStatements(ctx, c) };
        break;
      }
      case GuptaAstElemType.SET: {
        stms.push({
          type: GuptaStatment.SET,
          left: c.left,
          // TODO: Use "sanitizeCondition" but don't do the changes inside quoted parts like SQL statements
          right: sanitizeStatement(c.right),
        });
        break;
      }
      case GuptaAstElemType.CALL: {
        stms.push({
          type: GuptaStatment.CALL,
          line: sanitizeCondition(c.statement),
        });
        break;
      }
      case GuptaAstElemType.RETURN: {
        stms.push({
          type: GuptaStatment.RETURN,
          value: c.value && sanitizeCondition(c.value),
        });
        break;
      }
      case GuptaAstElemType.SELECT_CASE: {
        if (!c.children)
          return ctx
            .withElem(c)
            .throw("getBodyStatements: No childrens in SELECT_CASE");
        const s = c.children.reduce<
          Pick<GuptaSwitchStatement, "cases" | "default">
        >(
          (red, elem) => {
            if (elem.type === GuptaAstElemType.COMMENT) {
              red.cases.push({ comment: elem.stm });
              return red;
            }

            if (elem.type === GuptaAstElemType.SELECT_CASE_CASE) {
              red.cases.push({
                condition: elem.condition,
                body: getBodyStatements(ctx, elem),
              });
              return red;
            }

            if (elem.type === GuptaAstElemType.SELECT_CASE_DEFAULT) {
              red.default = getBodyStatements(ctx, elem);
              return red;
            }

            return ctx
              .withElem(elem)
              .throw(
                "getBodyStatements: SELECT_CASE: Unexpected child elem type",
              );
          },
          { cases: [], default: undefined },
        );
        stms.push({ type: GuptaStatment.SWITCH, value: c.value, ...s });
        break;
      }
      case GuptaAstElemType.BREAK: {
        stms.push({ type: GuptaStatment.BREAK });
        break;
      }
      case GuptaAstElemType.CONTINUE: {
        stms.push({ type: GuptaStatment.CONTINUE });
        break;
      }
      case GuptaAstElemType.WHILE: {
        stms.push({
          type: GuptaStatment.WHILE,
          condition: sanitizeCondition(c.condition),
          body: getBodyStatements(ctx, c),
        });
        break;
      }
      case GuptaAstElemType.LOOP: {
        stms.push({
          type: GuptaStatment.LOOP,
          body: getBodyStatements(ctx, c),
        });
        break;
      }
      case GuptaAstElemType.WHEN: {
        stms.push({
          type: GuptaStatment.LISTENER,
          event: c.event,
          body: getBodyStatements(ctx, c),
        });
        break;
      }
      default:
        return ctx
          .withElem(c)
          .throw("getBodyStatements: Unhandled body statement");
    }
  }

  return stms;
};

export const getFunctionSpec = (
  ctx: Context,
  elem: GuptaFunctionElem,
): GuptaFunctionSpec => {
  const fn: GuptaFunctionSpec = {
    name: elem.name,
    description: "",
    indent: elem.level,
    type: GuptaSpecType.FUNCTION,
    parameters: [],
    staticVars: [],
    returnType: "any",
    body: [],
  };

  elem.children!.forEach((e) => {
    if (e.type === GuptaAstElemType.ARRAY) {
      if (e.stm === "Parameters") {
        fn.parameters = getParameters(ctx, e);
        return;
      } else if (e.stm === "Local variables") {
        fn.localVars = getParameters(ctx, e);
        return;
      } else if (e.stm === "Static Variables") {
        fn.staticVars = getParameters(ctx, e);
        return;
      } else if (e.stm === "Returns") {
        // TODO: Do not ignore all other children (e.g. comments)
        const firstChild = e.children?.find(
          ({ type }) => type === GuptaAstElemType.ARRAY_ELEM,
        );
        fn.returnType = firstChild
          ? getPrimitve(ctx, firstChild.stm.split(":")[0], firstChild.stm)
          : "any";
        return;
      } else {
        return ctx.withElem(e).throw("getFunctionSpec: unexpected array");
      }
    }
    if (e.type === GuptaAstElemType.ATTRIBUTE) {
      if (e.name === "Description") {
        fn.description = e.value;
        return;
      }
      if (e.name === "Protected Function") {
        // TODO: Special meaning for functions from "Functional Class"es?
        return;
      }
      if (e.name === "Export Ordinal") {
        // TODO: What is that?
        return;
      }
    }
    if (e.stm === "Actions") {
      fn.body = getBodyStatements(ctx, e);
      return;
    }

    if (e.type === GuptaAstElemType.COMMENT) {
      // TODO: Where to place the comment?
      return;
    }
    return ctx.withElem(e).throw("getFunctionSpec: Unhandled child elem");
  });

  return fn;
};

export const getEvenHandlerSpec = (
  ctx: Context,
  elem: GuptaOnElem,
  inlineComment?: string,
): GuptaEventHandlerSpec => ({
  name: elem.stm,
  indent: elem.level,
  type: GuptaSpecType.EVENT_HANDLER,
  body: getBodyStatements(ctx, elem),
  inlineComment,
});

const getPopupMenuSpec = (
  elem: GuptaAttributeElem,
): GuptaPopupMenuSpec & GuptaBaseSpec => {
  const popup: GuptaPopupMenuSpec & GuptaBaseSpec = {
    name: elem.value as string,
    indent: elem.level,
    type: GuptaSpecType.POPUP_MENU,
    items: [],
    title: "TODO",
  };

  return popup;
};

const getSpecWithChildren = (
  ctx: Context,
  elem: GuptaAstElem,
): GuptaSpec | undefined => {
  const inlineComment = renderInlineComment(elem);

  if (elem.type === GuptaAstElemType.FUNCTION) {
    return getFunctionSpec(ctx, elem);
  }

  if (elem.type === GuptaAstElemType.ON) {
    return getEvenHandlerSpec(ctx, elem, inlineComment);
  }

  if (elem.type === GuptaAstElemType.ARRAY) {
    if (elem.stm === "Window Variables") {
      return {
        name: "Window Variables", // TODO: actually not required
        indent: elem.level, // TODO: actually not required
        type: GuptaSpecType.WINDOW_VARS,
        vars: getParameters(ctx, elem),
        inlineComment,
      };
    }
    return {
      name: "TODO Array: " + elem.stm.trim(),
      indent: elem.level,
      type: GuptaSpecType.OBJECT,
      props: [],
      inlineComment,
    };
  }

  if (elem.type === GuptaAstElemType.OBJECT) {
    const props = elem.children!.map((e) => getSpec(ctx, e)).filter(Boolean);
    if (!CONFIG.verbose && !props.length) return undefined;
    return {
      name: elem.stm,
      indent: elem.level,
      type: GuptaSpecType.OBJECT,
      props,
      inlineComment,
    };
  }

  if (elem.type === GuptaAstElemType.ATTRIBUTE) {
    if (elem.name === "Popup Menu") return getPopupMenuSpec(elem);
    const props = elem.children!.map((e) => getSpec(ctx, e)).filter(Boolean);
    if (!CONFIG.verbose && !props.length) return undefined;
    return {
      name: elem.value,
      clazz: elem.name,
      indent: elem.level,
      type: GuptaSpecType.OBJECT,
      props,
      inlineComment,
    };
  }

  return ctx
    .withElem(elem)
    .throw("getSpecWithChildren: Cannot handle elem type");
};

export const getSpec = (
  ctx: Context,
  elem: GuptaAstElem,
): GuptaSpec | undefined => {
  // if (elem.lineNr === 40851) console.log(elem);
  if (
    !CONFIG.verbose &&
    elem.type === GuptaAstElemType.OBJECT &&
    BLACK_LIST_OBJECTS.has(elem.stm)
  )
    return undefined;
  if (elem.type === GuptaAstElemType.COMMENT)
    return {
      type: GuptaSpecType.COMMENT,
      content: renderComment(elem),
    };
  if (!elem.children) {
    const withoutChild = getSpecWithoutChildren(ctx, elem);
    if (!withoutChild) return undefined;
    return withoutChild;
  }
  return getSpecWithChildren(ctx, elem);
};

type GuptaFiles = {
  files: Record<string, GuptaFile>;
  declarations: GlobalDeclarations;
  libraries: Array<{
    ctx: Context;
    dirName: string;
    files: Record<string, GuptaFile>;
    declarations: GlobalDeclarations;
  }>;
};

export const parseGuptaFiles = async (
  ctx: Context,
  ast: GuptaAstElem,
  availableLibsMap: AvailableLibsMap,
): Promise<GuptaFiles> => {
  const files: Record<string, GuptaFile> = {};
  let declarations = null! as GlobalDeclarations;
  const libraries: GuptaFiles["libraries"] = [];
  for (const c of ast.children || []) {
    if (c.type === GuptaAstElemType.COMMENT) {
      // ignoring top level comments for now
      continue;
    }

    if (!c.children) {
      // only one element falls into that category currently. The version string.
      continue;
    }

    const category =
      c.type === GuptaAstElemType.ATTRIBUTE
        ? c.name.replace(/\s+/g, "_")
        : undefined;

    const name = (
      c.type === GuptaAstElemType.ATTRIBUTE ? c.value : c.stm
    ).replace(/\s+/g, "_");

    if (name === "Global_Declarations") {
      declarations = getGlobalDeclarations(ctx, c);
      continue;
    }

    if (name === "Libraries") {
      const libs = await getLibraries(ctx, c, availableLibsMap);
      for (const lib of libs) {
        const parsedLib = await parseGuptaFiles(
          lib.ctx,
          lib.ast,
          availableLibsMap,
        );

        libraries.push(
          {
            ctx: lib.ctx,
            dirName: path.join(
              lib.relativeDir,
              lib.name.replace(/\.apl$/i, ""),
            ),
            files: parsedLib.files,
            declarations: parsedLib.declarations,
          },
          ...parsedLib.libraries,
        );
      }
      continue;
    }

    const spec = getSpec(ctx, c);
    if (!spec)
      ctx.throw("parseGuptaFiles: Empty file: " + `${category}/${name}`);

    if (category) {
      files[`${category}/${name}`] = {
        data: c.data,
        spec,
      };
    } else {
      files[`${name}`] = { data: c.data, spec };
    }
  }
  return { files, declarations, libraries };
};
