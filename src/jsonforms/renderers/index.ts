import { RankedTester } from "@jsonforms/core";
import {
  RemoraidControlRenderer,
  RemoraidLayoutRenderer,
  RemoraidRenderer,
} from "../lib/types";
import AnyControl from "./AnyControl";
import AnyOfControl from "./AnyOfControl";
import ArrayControl from "./ArrayControl";
import CheckboxControl from "./CheckboxControl";
import NumberControl from "./NumberControl";
import ObjectControl from "./ObjectControl";
import StringSelectControl from "./StringSelectControl";
import anyControlTesters from "./testers/anyControlTesters";
import anyOfControlTester from "./testers/anyOfControlTester";
import arrayControlTester from "./testers/arrayControlTester";
import checkboxControlTester from "./testers/checkboxControlTester";
import numberControlTester from "./testers/numberControlTester";
import objectControlTester from "./testers/objectControlTester";
import stringSelectControlTester from "./testers/stringSelectControlTester";
import textControlTester from "./testers/textControlTester";
import timestampControlTester from "./testers/timestampControlTester";
import verticalLayoutTester from "./testers/verticalLayoutTester";
import TextControl from "./TextControl";
import TimestampControl from "./TimestampControl";
import VerticalLayout from "./VerticalLayout";

export const combineTesters =
  (...testers: RankedTester[]): RankedTester =>
  (uischema, schema, ctx) =>
    testers.reduce(
      (best, tester) => Math.max(best, tester(uischema, schema, ctx)),
      -1
    );

export const remoraidControlRenderers: RemoraidControlRenderer[] = [
  { renderer: ArrayControl, tester: arrayControlTester },
  { renderer: CheckboxControl, tester: checkboxControlTester },
  { renderer: NumberControl, tester: numberControlTester },
  { renderer: StringSelectControl, tester: stringSelectControlTester },
  { renderer: TextControl, tester: textControlTester },
  { renderer: TimestampControl, tester: timestampControlTester },
  { renderer: ObjectControl, tester: objectControlTester },
  { renderer: AnyOfControl, tester: anyOfControlTester },
  { renderer: AnyControl, tester: combineTesters(...anyControlTesters) },
];

export const remoraidLayoutRenderers: RemoraidLayoutRenderer[] = [
  { renderer: VerticalLayout, tester: verticalLayoutTester },
];

export const remoraidRenderers: RemoraidRenderer[] = [
  ...remoraidControlRenderers,
  ...remoraidLayoutRenderers,
];
