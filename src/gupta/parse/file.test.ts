import { describe, expect, it } from "bun:test";
import { sanitizeCondition, sanitizeStatement } from "./file";

describe("wawi gupta parse - file", () => {
  it("sanitizeCondition", () => {
    expect(
      sanitizeCondition(
        "If ( iv_foo[nIndex] > 0  )  AND ( ( gv_settings.GetFoo() ) OR NOT ( ( iv_bar = 1 ) AND ( iv_thing[nIndex] = 1 ) ) )",
      ),
    ).toBe(
      "If ( iv_foo[nIndex] > 0  )  && ( ( gv_settings.GetFoo() ) || !( ( iv_bar === 1 ) && ( iv_thing[nIndex] === 1 ) ) )",
    );

    expect(
      sanitizeCondition(
        `"
  INSERT INTO
    MY_TABLE
    ( FIELD_1, FIELD_2, FIELD_3, FIELD_4 )
  VALUES
    ( :myVar.id, :other_var.foo, :thing, :foo[index] )"`,
      ),
    ).toBe(
      `\`
  INSERT INTO
    MY_TABLE
    ( FIELD_1, FIELD_2, FIELD_3, FIELD_4 )
  VALUES
    ( \${myVar.id}, \${other_var.foo}, \${thing}, \${foo[index]} )\``,
    );
  });

  it("sanitizeStatement", () => {
    expect(
      sanitizeStatement(
        `sSql || "
                  UNION
                  SELECT
                    FOO, BAR
                  FROM
                    THING,
                    OTHER
                  WHERE
                    COND = :thing AND
                    BLUB = '" || some.func() || "' AND
                    WHAT = 1 AND
                    " ||  whatever.func( andAnother.func(), test )  || "

                    " ||  whatever.func2( test2 ) || "

                  "`,
      ),
    ).toBe(
      `sSql + \`
                  UNION
                  SELECT
                    FOO, BAR
                  FROM
                    THING,
                    OTHER
                  WHERE
                    COND = \${thing} AND
                    BLUB = '\` + some.func() + \`' AND
                    WHAT = 1 AND
                    \` +  whatever.func( andAnother.func(), test )  + \`

                    \` +  whatever.func2( test2 ) + \`

                  \``,
    );

    // TODO
    // expect(sanitizeStatement(`NOT thing()`)).toBe(`!thing()`);
    // TODO
    // expect(
    //   sanitizeStatement(`( NOT bThing1 ) AND ( ( bThing2 ) OR ( bThing3 ) )`),
    // ).toBe(`( !bThing1 ) && ( ( bThing2 ) || ( bThing3 ) )`);
  });
});
