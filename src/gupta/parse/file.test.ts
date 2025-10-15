import { describe, expect, it } from "bun:test";
import { sanitizeCondition } from "./file";

describe("wawi gupta parse - file", () => {
  it("sanitizeCondition", () => {
    expect(
      sanitizeCondition(
        "If ( iv_foo[nIndex] > 0  )  AND ( ( gv_settings.GetFoo() ) OR NOT ( ( iv_bar = 1 ) AND ( iv_thing[nIndex] = 1 ) ) )",
      ),
    ).toBe(
      "If ( iv_foo[nIndex] > 0  )  && ( ( gv_settings.GetFoo() ) || !( ( iv_bar === 1 ) && ( iv_thing[nIndex] === 1 ) ) )",
    );
  });
});
