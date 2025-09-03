import { CLI } from "brocolito";
import { guptaTree } from "./gupta/guptaTree";

CLI.command("convert", "Create gupta tree from source file")
  .arg("<source:file>", "the source file (e.g. foo.apt)")
  .action(guptaTree);

CLI.parse(); // this needs to be executed after all "commands" were set up
