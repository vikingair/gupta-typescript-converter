import fs from "node:fs/promises";
import path from "node:path";
import { getGuptaAst } from "./ast";
import { guptaEnvDTS } from "./env";
import { _errorConfig } from "./error";
import { parseGuptaFiles } from "./parse/file";
import { type GlobalDeclarations } from "./parse/global_declarations";
import { GuptaSpecType, type GuptaFile } from "./parse/types";
import { renderGlobalClasses } from "./render/globals/classes";
import { renderGlobalConstants } from "./render/globals/constants";
import { renderGlobalFunctions } from "./render/globals/functions";
import { renderGlobalVariables } from "./render/globals/variables";
import { renderGuptaFile } from "./render/render";
import { CLI } from "brocolito";
import packageJSON from "../../package.json";
import { parseLibraries } from "./parse/libraries";

const writeFiles = async (
  projectRootDir: string,
  targetDir: string,
  files: Record<string, GuptaFile>,
  declarations: GlobalDeclarations,
) => {
  for (const [fileName, guptaFile] of Object.entries(files)) {
    if (
      guptaFile.spec.type === GuptaSpecType.OBJECT &&
      guptaFile.spec.name === "Libraries"
    ) {
      // does not yet have any effect
      await parseLibraries(projectRootDir, guptaFile.spec).catch((err) => {
        console.log(
          `Could not parse Libraries in ${projectRootDir}: ${err.message}`,
        );
      });
      continue;
    }
    const fileContent = renderGuptaFile(guptaFile, declarations).trim();
    if (!fileContent) continue;
    const targetFile = path.join(targetDir, fileName + ".ts");
    const fileDir = path.dirname(targetFile);
    await fs.mkdir(fileDir, { recursive: true });
    await fs.writeFile(targetFile, fileContent + "\n");
  }
  await fs.writeFile(
    path.join(targetDir, `generator_version.${packageJSON.version}.txt`),
    "Commit history can be found at: https://github.com/vikingair/gupta-typescript-converter\n",
  );
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

  const sourcesDir = path.dirname(path.resolve(source));
  if (path.basename(sourcesDir) !== "Sources")
    throw new Error(
      "Is expected to run convert file located in 'Sources' dir.",
    );

  const projectRootDir = path.resolve(sourcesDir, "..");

  _errorConfig.sourceFile = path.resolve(source);
  const content = await Bun.file(source).text();
  const lines = content
    .replaceAll("\t", "  ")
    .replaceAll(/\r/g, "")
    .split("\n");

  const ast = getGuptaAst(lines);
  const { files, declarations } = parseGuptaFiles(ast);

  const tsRootDir = path.join(projectRootDir, "typescript");
  await fs.rm(tsRootDir, { recursive: true, force: true });
  await fs.mkdir(path.join(tsRootDir, "Global_Declarations", "Constants"), {
    recursive: true,
  });

  await writeFiles(projectRootDir, tsRootDir, files, declarations);
};
