import {
  rankWith,
  uiTypeIs,
  and,
  schemaTypeIs,
  or,
  RankedTester,
} from "@jsonforms/core";

const tester: RankedTester = rankWith(8, (a, b, c) => {
  if (b.type === "integer") {
    return true;
  }
  return and(
    uiTypeIs("Control"),
    or(schemaTypeIs("number"), schemaTypeIs("integer"))
  )(a, b, c);
});

export default tester;
