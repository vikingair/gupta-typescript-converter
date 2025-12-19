export const enum GuptaAstElemType {
  ATTRIBUTE = 0,
  OBJECT = 1,
  COMMENT = 2,
  SET = 3,
  IF = 4,
  ELSE = 5,
  ELSE_IF = 6,
  RETURN = 7,
  ON = 8,
  CALL = 9,
  ARRAY = 10,
  ARRAY_ELEM = 11,
  SELECT_CASE = 12,
  LOOP = 13,
  WHILE = 14,
  FUNCTION = 15,
  BREAK = 16,
  SELECT_CASE_DEFAULT = 17,
  SELECT_CASE_CASE = 18,
  WHEN = 19,
  CONTINUE = 20,
  BOOLEAN_ATTRIBUTE = 21,
}

export type GuptaAstElemBase = {
  stm: string;
  level: number;
  isCollapsible: boolean;
  lineNr: number;
  inlineComment: string;
  parent?: GuptaAstElem;
  data?: Record<string, string>;
  children?: GuptaAstElem[];
};

export type GuptaAttributeElem = GuptaAstElemBase & {
  type: GuptaAstElemType.ATTRIBUTE;
  name: string;
  value: string;
};

export type GuptaBooleanAttributeElem = GuptaAstElemBase & {
  type: GuptaAstElemType.BOOLEAN_ATTRIBUTE;
  name: string;
  value: boolean;
};

type GuptaObjectElem = GuptaAstElemBase & {
  type: GuptaAstElemType.OBJECT;
};

type GuptaCommentElem = GuptaAstElemBase & {
  type: GuptaAstElemType.COMMENT;
};
type GuptaSetElem = GuptaAstElemBase & {
  type: GuptaAstElemType.SET;
  left: string;
  right: string;
};
type GuptaIfElem = GuptaAstElemBase & {
  type: GuptaAstElemType.IF;
  condition: string;
};
type GuptaElseElem = GuptaAstElemBase & {
  type: GuptaAstElemType.ELSE;
};
type GuptaElseIfElem = GuptaAstElemBase & {
  type: GuptaAstElemType.ELSE_IF;
  condition: string;
};
type GuptaReturnElem = GuptaAstElemBase & {
  type: GuptaAstElemType.RETURN;
  value?: string;
};
export type GuptaOnElem = GuptaAstElemBase & {
  type: GuptaAstElemType.ON;
};
type GuptaCallElem = GuptaAstElemBase & {
  type: GuptaAstElemType.CALL;
  statement: string;
};
type GuptaArrayElem = GuptaAstElemBase & {
  type: GuptaAstElemType.ARRAY;
};
type GuptaArrayElemElem = GuptaAstElemBase & {
  type: GuptaAstElemType.ARRAY_ELEM;
};
type GuptaSelectCaseElem = GuptaAstElemBase & {
  type: GuptaAstElemType.SELECT_CASE;
  value: string;
};
type GuptaLoopElem = GuptaAstElemBase & {
  type: GuptaAstElemType.LOOP;
};
type GuptaWhileElem = GuptaAstElemBase & {
  type: GuptaAstElemType.WHILE;
  condition: string;
};
export type GuptaFunctionElem = GuptaAstElemBase & {
  type: GuptaAstElemType.FUNCTION;
  name: string;
};
type GuptaBreakElem = GuptaAstElemBase & {
  type: GuptaAstElemType.BREAK;
};
type GuptaSelectCaseCaseElem = GuptaAstElemBase & {
  type: GuptaAstElemType.SELECT_CASE_CASE;
  condition: string;
};
type GuptaSelectCaseDefaultElem = GuptaAstElemBase & {
  type: GuptaAstElemType.SELECT_CASE_DEFAULT;
};
type GuptaWhenElem = GuptaAstElemBase & {
  type: GuptaAstElemType.WHEN;
  event: string;
};
type GuptaContinueElem = GuptaAstElemBase & {
  type: GuptaAstElemType.CONTINUE;
};

export type GuptaAstElem =
  | GuptaAttributeElem
  | GuptaBooleanAttributeElem
  | GuptaObjectElem
  | GuptaCommentElem
  | GuptaSetElem
  | GuptaIfElem
  | GuptaElseElem
  | GuptaElseIfElem
  | GuptaReturnElem
  | GuptaOnElem
  | GuptaCallElem
  | GuptaArrayElem
  | GuptaArrayElemElem
  | GuptaSelectCaseElem
  | GuptaSelectCaseCaseElem
  | GuptaSelectCaseDefaultElem
  | GuptaLoopElem
  | GuptaWhileElem
  | GuptaFunctionElem
  | GuptaBreakElem
  | GuptaWhenElem
  | GuptaContinueElem;

const getStm = (
  content: string,
  isParentComment: boolean,
): { stm: string; inlineComment: string } => {
  if (isParentComment || content[0] === "!")
    return { stm: content.trim(), inlineComment: "" };

  let code = "";
  let activeComment = false;
  let comment = "";
  let activeQuote = "";
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (c === "\n") {
      activeComment = false;
      // we don't care about any whitespace at the end of a line. IDEs would also just remove those on save.
      // we don't use .trimEnd() here as we want to keep additional newlines.
      code = code.replace(/ +$/g, "");
      code += c;
    } else if (activeComment) {
      comment += c;
    } else if (activeQuote) {
      if (c === activeQuote) activeQuote = "";
      code += c;
    } else if (c === "'" || c === '"') {
      activeQuote = c;
      code += c;
    } else if (c === "!" && content[i + 1] !== "=") {
      activeComment = true;
      comment += c;
    } else {
      code += c;
    }
  }
  return { stm: code.trim(), inlineComment: comment.trim() };
};

const getAstElemType = (
  stm: string,
  parentType?: GuptaAstElemType,
): GuptaAstElemType => {
  if (stm.startsWith("!") || parentType === GuptaAstElemType.COMMENT)
    return GuptaAstElemType.COMMENT;
  if (parentType === GuptaAstElemType.ARRAY) return GuptaAstElemType.ARRAY_ELEM;

  const { first, second } =
    stm.match(/^(?<first>[a-z]+)( (?<second>[a-z]+))?/i)?.groups ?? {};

  if (first === "Set") return GuptaAstElemType.SET;
  if (first === "If") return GuptaAstElemType.IF;
  if (first === "Else")
    return second === "If" ? GuptaAstElemType.ELSE_IF : GuptaAstElemType.ELSE;
  if (first === "Return") return GuptaAstElemType.RETURN;
  if (first === "On" || stm === "Menu Actions") return GuptaAstElemType.ON;
  if (first === "Call") return GuptaAstElemType.CALL;
  if (first === "Select" && second === "Case")
    return GuptaAstElemType.SELECT_CASE;
  if (first === "Default") return GuptaAstElemType.SELECT_CASE_DEFAULT;
  if (first === "Case") return GuptaAstElemType.SELECT_CASE_CASE;
  if (first === "While") return GuptaAstElemType.WHILE;
  if (first === "When") return GuptaAstElemType.WHEN;
  if (first === "Loop") return GuptaAstElemType.LOOP;
  if (first === "Break") return GuptaAstElemType.BREAK;
  if (first === "Continue") return GuptaAstElemType.CONTINUE;

  if (stm.startsWith("Function: ")) return GuptaAstElemType.FUNCTION;
  const attrType = stm.match(/^[[a-z0-9./ ]+([:?])/i)?.[1];
  if (attrType === ":") return GuptaAstElemType.ATTRIBUTE;
  if (attrType === "?") return GuptaAstElemType.BOOLEAN_ATTRIBUTE;
  if (stm.toLowerCase().endsWith("variables")) return GuptaAstElemType.ARRAY;
  if (stm.toLowerCase().endsWith("parameters")) return GuptaAstElemType.ARRAY;
  if (stm === "Formats" || stm === "Returns") return GuptaAstElemType.ARRAY;

  return GuptaAstElemType.OBJECT;
};

const getAstElem = (base: GuptaAstElemBase): GuptaAstElem => {
  const type = getAstElemType(base.stm, base.parent?.type);
  if (type === GuptaAstElemType.ATTRIBUTE) {
    const m = base.stm.match(/^([a-z0-9./ ]+):([\s\S]*)/i);
    if (!m) {
      throw new Error("cannot match attribute: " + base.stm);
    }
    return {
      ...base,
      type,
      name: m[1],
      value: m[2].trim(),
    };
  } else if (type === GuptaAstElemType.BOOLEAN_ATTRIBUTE) {
    const m = base.stm.match(/^([a-z0-9./ ]+)\?([\s\S]*)/i);
    if (!m) {
      throw new Error("cannot match boolean attribute: " + base.stm);
    }
    return {
      ...base,
      type,
      name: m[1],
      value: m[2] === "Yes" ? true : false,
    };
  } else if (type === GuptaAstElemType.SELECT_CASE) {
    const v = base.stm.match(/Select Case ([\S\s]*)/)![1].trim();
    // wrap value in brackets as it is not required in Gupta
    const value = v.startsWith("(") ? v : `(${v})`;
    return { ...base, type, value };
  } else if (type === GuptaAstElemType.SELECT_CASE_CASE) {
    const condition = base.stm.match(/Case (.*)/)![1].trim();
    return { ...base, type, condition };
  } else if (type === GuptaAstElemType.WHILE) {
    const condition = base.stm.match(/While ([\S\s]*)/)![1];
    return { ...base, type, condition };
  } else if (type === GuptaAstElemType.WHEN) {
    const event = base.stm.match(/When ([\S\s]+)/)![1];
    return { ...base, type, event };
  } else if (type === GuptaAstElemType.RETURN) {
    const value = base.stm.match(/Return([\S\s]*)/)![1].trim();
    return { ...base, type, value: value || undefined };
  } else if (type === GuptaAstElemType.SET) {
    const m = base.stm.match(/Set ([^=]+)=([\S\s]+)/)!;
    return { ...base, type, left: m[1].trim(), right: m[2].trim() };
  } else if (type === GuptaAstElemType.IF) {
    const condition = base.stm.match(/If([\S\s]*)/)![1].trim();
    return { ...base, type, condition };
  } else if (type === GuptaAstElemType.ELSE_IF) {
    const condition = base.stm.match(/Else If([\S\s]*)/)![1].trim();
    return { ...base, type, condition };
  } else if (type === GuptaAstElemType.CALL) {
    const statement = base.stm.match(/Call ([\S\s]*)/)![1];
    return { ...base, type, statement };
  } else if (type === GuptaAstElemType.FUNCTION) {
    const name = base.stm.match(/Function: (.+)/)![1].trim();
    return { ...base, type, name };
  } else {
    return { ...base, type };
  }
};

export const getGuptaAst = (content: string): GuptaAstElem => {
  const lines = content
    .replaceAll("\t", "  ")
    .replaceAll(/\r/g, "")
    .split("\n");

  const topLevel: GuptaAstElem = {
    stm: "Module",
    level: -1,
    lineNr: 0,
    isCollapsible: true,
    type: GuptaAstElemType.OBJECT,
    inlineComment: "",
  };

  let current: GuptaAstElem = topLevel;
  let dataBuffer: string[] = [];
  let dataName = "";
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const lineNr = i + 1;
    if (dataName) {
      if (l === ".enddata") {
        current.data ??= {};
        current.data[dataName] =
          dataBuffer.length > 1
            ? `\n${dataBuffer.join("\n")}\n`
            : (dataBuffer[0] ?? "");
        dataName = "";
        dataBuffer = [];
      } else {
        dataBuffer.push(l);
      }
      continue;
    }

    // these two are just syntax sugar for Gupta
    if (l.startsWith(".winattr") || l === ".end") continue;

    if (l.startsWith(".data")) {
      dataName = l.substring(6); // ".data".length + 1
      continue;
    }

    const lineMatch = l.match(/^.head (\d+) ([+-])\s+(.*)$/);
    if (!lineMatch) {
      throw new Error("Did find unexpected line to be processed:\n" + l);
    }

    const [, levelStr, plusOrMinus, content] = lineMatch;

    let nextLine = lines[i + 1];
    let multilineContent = content;
    while (
      nextLine !== undefined &&
      // every line starting with a single dot followed by a letter is a new ast elem
      !/^\.[a-z]/.test(nextLine)
    ) {
      multilineContent += "\n" + nextLine;
      i++;
      nextLine = lines[i + 1];
    }

    const level = +levelStr;
    const isCollapsible = plusOrMinus === "+";

    while (level <= current.level) {
      if (!current.parent) throw new Error("No parent found");
      current = current.parent;
    }

    current.children ??= [];
    const { stm, inlineComment } = getStm(
      multilineContent,
      current.type === GuptaAstElemType.COMMENT,
    );
    const elem = getAstElem({
      stm,
      level,
      parent: current,
      isCollapsible,
      lineNr,
      inlineComment,
    });

    // if (lineNr === 27100) console.log(">>> elem", elem.stm);

    current.children.push(elem);
    current = elem;
  }

  return topLevel.children![0];
};
