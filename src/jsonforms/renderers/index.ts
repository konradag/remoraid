import {
  RemoraidControlRenderer,
  RemoraidLayoutRenderer,
  RemoraidRenderer,
} from "../lib/types";
import AnyOfControl from "./AnyOfControl";
import ArrayControl from "./ArrayControl";
import CheckboxControl from "./CheckboxControl";
import NumberControl from "./NumberControl";
import ObjectControl from "./ObjectControl";
import StringSelectControl from "./StringSelectControl";
import anyOfTester from "./testers/anyOfTester";
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

export const remoraidControlRenderers: RemoraidControlRenderer[] = [
  { renderer: ArrayControl, tester: arrayControlTester },
  { renderer: CheckboxControl, tester: checkboxControlTester },
  { renderer: NumberControl, tester: numberControlTester },
  { renderer: StringSelectControl, tester: stringSelectControlTester },
  { renderer: TextControl, tester: textControlTester },
  { renderer: TimestampControl, tester: timestampControlTester },
  { renderer: ObjectControl, tester: objectControlTester },
  { renderer: AnyOfControl, tester: anyOfTester },
];

export const remoraidLayoutRenderers: RemoraidLayoutRenderer[] = [
  { renderer: VerticalLayout, tester: verticalLayoutTester },
];

export const remoraidRenderers: RemoraidRenderer[] = [
  ...remoraidControlRenderers,
  ...remoraidLayoutRenderers,
];
