import {
  rankWith,
  uiTypeIs,
  and,
  schemaTypeIs,
  isEnumControl,
  RankedTester,
} from "@jsonforms/core";

const tester: RankedTester = rankWith(
  11,
  and(uiTypeIs("Control"), schemaTypeIs("string"), isEnumControl)
);

export default tester;
