import { type GlobalDeclarations } from "../../parse/global_declarations";

export const renderGlobalIncludes = (
  declarations: GlobalDeclarations,
  relativePath = "../Global_Declarations",
): string =>
  Object.keys(declarations.constants)
    .map((key) => `import "${relativePath}/constants/${key}";`)
    .concat([
      `import "${relativePath}/functions";`,
      `import "${relativePath}/variables";`,
      `import "../env";`,
    ])
    .join("\n") + "\n\n";
