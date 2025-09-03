import { type GlobalDeclarations } from "../../parse/global_declarations";

export const renderGlobalConstants = (
  consts: GlobalDeclarations["constants"][string],
): string => {
  if (!consts.length) throw new Error("renderGlobalConstants: No consts found");
  return "// TODO";
};
