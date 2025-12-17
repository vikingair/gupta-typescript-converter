import { CLI } from "brocolito";
import fs from "node:fs/promises";
import path from "node:path";
import packageJSON from "../../package.json";
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
import { readFile } from "./utils";

const writeGlobalFiles = async (targetDir: string) => {
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(
    path.join(targetDir, `generator_version.${packageJSON.version}.txt`),
    "Commit history can be found at: https://github.com/vikingair/gupta-typescript-converter\n",
  );
  await fs.writeFile(path.join(targetDir, "env.ts"), guptaEnvDTS);
  await fs.copyFile(
    path.join(CLI.meta.dir, "src", "tsconfig.template.json"),
    path.join(targetDir, "tsconfig.json"),
  );
};

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

  await fs.mkdir(path.join(targetDir, "Global_Declarations", "Constants"), {
    recursive: true,
  });

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
  const ast = getGuptaAst(await readFile(source));

  const allAvailableLibs = await Array.fromAsync(
    fs.glob(path.join("{LCL,ShareableFiles}", "**", "*.{apl,APL}"), {
      cwd: projectRootDir,
    }),
  );

  const availableLibsMap = new Map<
    string,
    { name: string; relativeDir: string; dir: string; processed: boolean }
  >(
    allAvailableLibs.map((lib) => {
      const name = path.basename(lib);
      const relativeDir = path.dirname(lib);
      return [
        name.toLowerCase(),
        {
          name,
          relativeDir,
          dir: path.resolve(projectRootDir, relativeDir),
          processed: false,
        },
      ];
    }),
  );
  const { files, declarations, libraries } = await parseGuptaFiles(
    ast,
    availableLibsMap,
  );

  const tsRootDir = path.join(projectRootDir, "typescript");
  await fs.rm(tsRootDir, { recursive: true, force: true });

  await writeGlobalFiles(tsRootDir);
  await writeFiles(tsRootDir, files, declarations);
  await Array.fromAsync(
    libraries.map(async ({ dirName, files, declarations }) => {
      await writeFiles(
        path.join(tsRootDir, "Libraries", dirName),
        files,
        declarations,
      );
    }),
  );
};
