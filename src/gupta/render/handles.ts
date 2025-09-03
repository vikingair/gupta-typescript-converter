import { getPrimitve } from "../parse/shared";
import { type GuptaBaseSpec } from "../parse/types";
import { type GuptaFileContents, TS_TYPES } from "./shared";

export const renderHandles = ({ specs }: GuptaFileContents) => {
  let content = "";
  if ("Option_Button" in specs) {
    content += "// Inputs: Option Button\n";
    content +=
      (specs["Option_Button"] as GuptaBaseSpec[])
        .map(({ name }) => `let ${name}: boolean;\n`)
        .join("") + "\n";
  }
  if ("Combo_Box" in specs) {
    content += "// Inputs: Combo Box\n";
    content +=
      (specs["Combo_Box"] as GuptaBaseSpec[])
        .map(({ name }) => `let ${name}: string[];\n`)
        .join("") + "\n";
  }
  if ("Data_Field" in specs) {
    content += "// Inputs: Data Field\n";
    content +=
      (specs["Data_Field"] as GuptaBaseSpec[])
        .map((dataField) => {
          let type = "string";
          try {
            const dataType = (dataField as any).props
              .find(({ name }: { name: string }) => name === "Data")
              .props.find(
                ({ name }: { name: string }) => name === "Data Type",
              ).value;
            const classType = (dataField as any).props.find(
              ({ name }: { name: string }) => name === "Class",
            ).value;
            const usedType =
              dataType === "Class Default" && classType === "DF_LD_Date"
                ? "Date/Time"
                : dataType;
            type = TS_TYPES[getPrimitve(usedType)];
          } catch {
            // do nothing
          }
          return `let ${dataField.name}: ${type};\n`;
        })
        .join("") + "\n";
  }
  if ("Check_Box" in specs) {
    content += "// Inputs: Check Box\n";
    content +=
      (specs["Check_Box"] as GuptaBaseSpec[])
        .map(({ name }) => `let ${name}: boolean;\n`)
        .join("") + "\n";
  }
  if ("Pushbutton" in specs) {
    content += "// Window Handles: Pushbutton\n";
    content +=
      (specs["Pushbutton"] as GuptaBaseSpec[])
        .map(({ name }) => `let ${name}: Symbol;\n`)
        .join("") + "\n";
  }
  if ("Dialog_Box" in specs) {
    content += "// Window Handles: Dialog Box\n";
    content +=
      (specs["Dialog_Box"] as GuptaBaseSpec[])
        .map(({ name }) => `let ${name}: Symbol;\n`)
        .join("") + "\n";
  }
  if ("Child_Table" in specs) {
    content += "// Window Handles: Child Table\n";
    content +=
      (specs["Child_Table"] as GuptaBaseSpec[])
        // TODO: Create object with functions and columns
        .map(({ name }) => `let ${name}: any;\n`)
        .join("") + "\n";
  }
  return content;
};
