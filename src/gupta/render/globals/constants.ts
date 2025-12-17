import { type GlobalDeclarations } from "../../parse/global_declarations";

export const renderGlobalConstants = (
  consts: GlobalDeclarations["constants"][string],
): string => {
  if (!consts.length) throw new Error("renderGlobalConstants: No consts found");
  let result = "export {};\ndeclare global {\n";

  result += consts
    .map((v) => {
      if ("comment" in v) return "  // " + v.comment;
      if ("enumName" in v)
        return `  enum ${v.enumName} {
${v.items.map((i) => `    ${i}`).join(",\n")}
  }`;
      return `  let ${v.name}: ${v.value};`;
    })

    .filter(Boolean)
    .join("\n");

  result += "\n";

  return result + "}\n";
};
