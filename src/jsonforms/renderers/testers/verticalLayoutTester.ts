import { RankedTester, rankWith, uiTypeIs } from "@jsonforms/core";

const tester: RankedTester = rankWith(
  2, // higher than 1
  uiTypeIs("VerticalLayout")
);

export default tester;
