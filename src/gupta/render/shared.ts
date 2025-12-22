import {
  type GuptaCommentSpec,
  type GuptaFunctionSpec,
  GuptaPrimitive,
  type GuptaSpec,
  type GuptaWindowVarsSpec,
} from "../parse/types";

export type GuptaFileContents = {
  data?: Record<string, string>;
  specs: Record<string, GuptaSpec[]>;
  comments: GuptaCommentSpec[];
  windowVars: { names: string[]; specs: GuptaWindowVarsSpec[] };
  functions: GuptaFunctionSpec[];
};

export const TS_TYPES: Record<GuptaPrimitive, string> = {
  [GuptaPrimitive.BOOLEAN]: "boolean",
  [GuptaPrimitive.NUMBER]: "number",
  [GuptaPrimitive.DATE_TIME]: "Date",
  [GuptaPrimitive.SQL_HANDLE]: "any",
  [GuptaPrimitive.WINDOW_HANDLE]: "any",
  [GuptaPrimitive.STRING]: "string",
  [GuptaPrimitive.FUNCTION]: "(...args: any[]) => any",
  [GuptaPrimitive.TODO]: "/* TODO */ unknown",
};

export const indent = (level: number, str?: string) => {
  const whitespace = "  ".repeat(level);
  if (str === undefined) return whitespace;
  if (!str) return "";
  return (
    str
      .split("\n")
      // no whitespace on empty lines
      .map((l) => (l ? whitespace + l : ""))
      .join("\n")
  );
};
