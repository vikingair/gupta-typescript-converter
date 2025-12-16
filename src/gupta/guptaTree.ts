import fs from "node:fs/promises";
import path from "node:path";
import { getGuptaAst } from "./ast";
import { guptaEnvDTS } from "./env";
import { _errorConfig } from "./error";
import { parseGuptaFiles } from "./parse/file";
import { type GlobalDeclarations } from "./parse/global_declarations";
import { type GuptaFile } from "./parse/types";
import { renderGlobalClasses } from "./render/globals/classes";
import { renderGlobalConstants } from "./render/globals/constants";
import { renderGlobalFunctions } from "./render/globals/functions";
import { renderGlobalVariables } from "./render/globals/variables";
import { renderGuptaFile } from "./render/render";
import { CLI } from "brocolito";

const writeFiles = async (
  targetDir: string,
  files: Record<string, GuptaFile>,
  declarations: GlobalDeclarations,
) => {
  for (const [fileName, guptaFile] of Object.entries(files)) {
    const fileContent = renderGuptaFile(guptaFile, declarations).trim();
    if (!fileContent) continue;
    const targetFile = path.join(targetDir, fileName + ".ts");
    const fileDir = path.dirname(targetFile);
    await fs.mkdir(fileDir, { recursive: true });
    await fs.writeFile(targetFile, fileContent + "\n");
  }
  await fs.writeFile(path.join(targetDir, "env.ts"), guptaEnvDTS);
  await fs.copyFile(
    path.join(CLI.meta.dir, "src", "tsconfig.template.json"),
    path.join(targetDir, "tsconfig.json"),
  );
  await fs.writeFile(
    path.join(targetDir, "Global_Declarations", "variables.ts"),
    renderGlobalVariables(declarations),
  );
  await fs.writeFile(
    path.join(targetDir, "Global_Declarations", "functions.ts"),
    renderGlobalFunctions(declarations),
  );
  await fs.writeFile(
    path.join(targetDir, "Global_Declarations", "classes.ts"),
    renderGlobalClasses(declarations),
  );
  for (const [constsName, consts] of Object.entries(declarations.constants)) {
    await fs.writeFile(
      path.join(
        targetDir,
        "Global_Declarations",
        "Constants",
        constsName + ".ts",
      ),
      renderGlobalConstants(consts),
    );
  }
};

// TODO: Load also all apl file declarations and aprs them into separate files
export const guptaTree = async ({ source }: { source: string }) => {
  if (path.extname(source) !== ".apt")
    throw new Error("Only works for .apt (gupta) files");

  _errorConfig.sourceFile = path.resolve(source);
  const content = await Bun.file(source).text();
  const lines = content
    .replaceAll("\t", "  ")
    .replaceAll(/\r/g, "")
    .split("\n");

  const ast = getGuptaAst(lines);
  const { files, declarations } = parseGuptaFiles(ast);

  const treeDir = path.join(path.dirname(source), "tree");
  await fs.rm(treeDir, { recursive: true, force: true });
  await fs.mkdir(path.join(treeDir, "Global_Declarations", "Constants"), {
    recursive: true,
  });

  await writeFiles(treeDir, files, declarations);
};
