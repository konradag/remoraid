import {
  rankWith,
  uiTypeIs,
  and,
  schemaTypeIs,
  scopeEndsWith,
  RankedTester,
} from "@jsonforms/core";

const tester: RankedTester = rankWith(
  11,
  and(uiTypeIs("Control"), schemaTypeIs("integer"), scopeEndsWith("startTime"))
);

export default tester;
