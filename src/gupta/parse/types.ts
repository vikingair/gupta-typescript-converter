export const enum GuptaSpecType {
  ATTRIBUTE = 0,
  OBJECT = 1,
  COMMENT = 2,
  FUNCTION = 3,
  EVENT_HANDLER = 4,
  POPUP_MENU = 5,
  WINDOW_VARS = 6,
  CLASS_DEFINITION = 7,
  BOOLEAN_ATTRIBUTE = 8,
}

export const enum GuptaPrimitive {
  DATE_TIME = 0,
  NUMBER = 1,
  BOOLEAN = 2,
  STRING = 3,
  WINDOW_HANDLE = 4,
  SQL_HANDLE = 5,
  FUNCTION = 6,
  TODO = 7,
}

export const enum GuptaStatment {
  SET = 0,
  CALL = 1,
  IF = 2,
  SWITCH = 3,
  COMMENT = 4,
  RETURN = 5,
  BREAK = 6,
  WHILE = 7,
  LOOP = 8,
  LISTENER = 9,
  CONTINUE = 10,
}

export const enum GuptaClassType {
  FUNCTIONAL = 0,
  DATA_FIELD = 1,
  CUSTOM_CONTROL = 2,
}

export type GuptaIfStatement = {
  type: GuptaStatment.IF;
  condition: string;
  body: GuptaBodyStatement[];
  elseIf: Array<{ condition: string; body: GuptaBodyStatement[] }>;
  else?: { body: GuptaBodyStatement[] };
};

export type GuptaWhileStatement = {
  type: GuptaStatment.WHILE;
  condition: string;
  body: GuptaBodyStatement[];
};

export type GuptaLoopStatement = {
  type: GuptaStatment.LOOP;
  body: GuptaBodyStatement[];
};

export type GuptaListenerStatement = {
  type: GuptaStatment.LISTENER;
  event: string;
  body: GuptaBodyStatement[];
};

export type GuptaSwitchStatement = {
  type: GuptaStatment.SWITCH;
  value: string;
  cases: Array<
    { condition: string; body: GuptaBodyStatement[] } | { comment: string }
  >;
  default?: GuptaBodyStatement[];
};

export type GuptaBodyStatement =
  | { type: GuptaStatment.COMMENT; content: string }
  | ({
      inlineComment?: string;
    } & (
      | { type: GuptaStatment.BREAK }
      | { type: GuptaStatment.CONTINUE }
      | { type: GuptaStatment.SET; left: string; right: string }
      | { type: GuptaStatment.CALL; line: string }
      | { type: GuptaStatment.RETURN; value?: string }
      | GuptaIfStatement
      | GuptaSwitchStatement
      | GuptaWhileStatement
      | GuptaLoopStatement
      | GuptaListenerStatement
    ));

export type GuptaParams = Array<
  | { name: string; type: GuptaPrimitive; isArray: boolean }
  | { name: string; className: string; isArray: boolean }
  | { comment: string }
>;

export type GuptaFunctionSpec = GuptaBaseSpec & {
  type: GuptaSpecType.FUNCTION;
  description: string;
  returnType: GuptaPrimitive | "any";
  parameters: GuptaParams;
  staticVars: GuptaParams;
  localVars?: GuptaParams;
  body: GuptaBodyStatement[];
};

export type GuptaEventHandlerSpec = GuptaBaseSpec & {
  type: GuptaSpecType.EVENT_HANDLER;
  body: GuptaBodyStatement[];
};

export type GuptaClassDefSpec = {
  type: GuptaSpecType.CLASS_DEFINITION;
  description: string;
  inheritedFrom: string[];
  classVars: GuptaParams;
  instanceVars: GuptaParams;
  functions: GuptaFunctionSpec[];
  actions: GuptaEventHandlerSpec[];
  dataType?: GuptaPrimitive;
};

export type GuptaPopupMenuSpec = {
  type: GuptaSpecType.POPUP_MENU;
  title: string;
  items: Array<{ title: string; body: GuptaBodyStatement[] }>;
};

export type GuptaBaseSpec = {
  name: string;
  indent: number;
  inlineComment?: string;
  data?: Record<string, string>;
};

export type GuptaWindowVarsSpec = {
  type: GuptaSpecType.WINDOW_VARS;
  vars: GuptaParams;
};

export type GuptaCommentSpec = { type: GuptaSpecType.COMMENT; content: string };

export type GuptaObjectSpec = {
  type: GuptaSpecType.OBJECT;
  props: GuptaSpec[];
  clazz?: string;
};

export type GuptaSpec =
  | GuptaCommentSpec
  | GuptaFunctionSpec
  | (GuptaBaseSpec &
      (
        | { type: GuptaSpecType.ATTRIBUTE; value: string }
        | { type: GuptaSpecType.BOOLEAN_ATTRIBUTE; value: boolean }
        | GuptaObjectSpec
        | GuptaWindowVarsSpec
        | GuptaPopupMenuSpec
        | GuptaEventHandlerSpec
      ));

export type GuptaFile = {
  data?: Record<string, string>;
  spec: GuptaSpec;
};
