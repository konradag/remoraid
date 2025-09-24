import {
  rankWith,
  uiTypeIs,
  and,
  isAnyOfControl,
  RankedTester,
} from "@jsonforms/core";

const tester: RankedTester = rankWith(
  10,
  and(uiTypeIs("Control"), isAnyOfControl)
);

export default tester;
