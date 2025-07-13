import {
  rankWith,
  uiTypeIs,
  and,
  schemaTypeIs,
  RankedTester,
} from "@jsonforms/core";

const tester: RankedTester = rankWith(
  10,
  and(uiTypeIs("Control"), schemaTypeIs("string"))
);

export default tester;
