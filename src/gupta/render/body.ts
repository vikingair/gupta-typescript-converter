import { type GuptaBodyStatement, GuptaStatment } from "../parse/types";
import { indent } from "./shared";

const renderBodyStatement = (
  stm: GuptaBodyStatement,
  level: number,
  availableVarNames: string[],
): string => {
  const i = indent(level);
  switch (stm.type) {
    case GuptaStatment.CALL:
      return `${i}${stm.line.replaceAll("||", "+").replaceAll("\n", "\n  " + i)}`;
    case GuptaStatment.SET: {
      if (
        availableVarNames.includes(stm.left) ||
        stm.left.includes(".") ||
        stm.left.includes("[")
      )
        return `${i}${stm.left.replaceAll(",", "][")} = ${stm.right}`;
      availableVarNames.push(stm.left);
      return `${i}let ${stm.left} = ${stm.right}`;
    }
    case GuptaStatment.COMMENT:
      // TODO: Find the issue in the previous steps. Sometimes the comment is already formatted and sometimes not
      return /^\s*\/\//.test(stm.content)
        ? stm.content
        : `${i}// ${stm.content}`;
    case GuptaStatment.RETURN:
      return `${i}return${stm.value ? " " + stm.value : ""};`;
    case GuptaStatment.SWITCH: {
      const i1 = indent(level + 1);
      return `${i}switch ${stm.value} {
${stm.cases
  .map((c) => {
    if ("comment" in c) return `${i}// ${c.comment}`;
    return `${i1}case ${c.condition}: {
${renderBodyStatements(c.body, level + 2, availableVarNames)}
${i1}}`;
  })
  .join("\n")}${
        stm.default
          ? `
${i1}default:{
${renderBodyStatements(stm.default, level + 2, availableVarNames)}
${i1}}`
          : ""
      }
${i}}`;
    }
    case GuptaStatment.IF: {
      let content = `${i}if (${stm.condition.replaceAll("\n", "\n  " + i)}) {\n${renderBodyStatements(stm.body, level + 1, availableVarNames)}\n${i}}`;
      for (const elif of stm.elseIf) {
        content += ` else if (${elif.condition.replaceAll("\n", "\n  " + i)}) {\n${renderBodyStatements(elif.body, level + 1, availableVarNames)}\n${i}}`;
      }
      if (stm.else) {
        content += ` else {\n${renderBodyStatements(stm.else.body, level + 1, availableVarNames)}\n${i}}`;
      }
      return content;
    }
    case GuptaStatment.BREAK: {
      return i + "break;";
    }
    case GuptaStatment.CONTINUE: {
      return i + "continue;";
    }
    case GuptaStatment.WHILE: {
      return `${i}while (${stm.condition.replaceAll("\n", "\n  " + i)}) {\n${renderBodyStatements(stm.body, level + 1, availableVarNames)}\n${i}}`;
    }
    case GuptaStatment.LOOP: {
      return `${i}while (true) {\n${renderBodyStatements(stm.body, level + 1, availableVarNames)}\n${i}}`;
    }
    case GuptaStatment.LISTENER: {
      return `${i}addListener("${stm.event}", () => {\n${renderBodyStatements(stm.body, level + 1, availableVarNames)}\n${i}});`;
    }
  }
};

export const renderBodyStatements = (
  stms: GuptaBodyStatement[],
  level: number,
  availableVarNames: string[],
  instanceVars?: string[],
): string => {
  // we create here a copy because the inner function will extend the array after each new variable assignment
  const varNames = [...availableVarNames];
  let result = stms
    .map((s) => renderBodyStatement(s, level, varNames))
    .join("\n");

  instanceVars?.forEach((iv) => {
    result = result
      .replaceAll(
        new RegExp(`([^a-zA-Z0-9_.])${iv}([^a-zA-Z0-9_])`, "g"),
        `$1this.${iv}$2`,
      )
      .replaceAll(new RegExp(`^${iv}([^a-zA-Z0-9_])`, "g"), `this.${iv}$1`)
      .replaceAll(new RegExp(`([^a-zA-Z0-9_.])${iv}$`, "g"), `$1this.${iv}`)
      .replaceAll("let this.", "this.");
  });

  return result;
};
