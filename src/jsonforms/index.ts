import AnyOfControl from "./renderers/AnyOfControl";
import ArrayControl from "./renderers/ArrayControl";
import CheckboxControl from "./renderers/CheckboxControl";
import NumberControl from "./renderers/NumberControl";
import ObjectControl from "./renderers/ObjectControl";
import StringSelectControl from "./renderers/StringSelectControl";
import anyOfTester from "./renderers/testers/anyOfTester";
import arrayControlTester from "./renderers/testers/arrayControlTester";
import checkboxControlTester from "./renderers/testers/checkboxControlTester";
import numberControlTester from "./renderers/testers/numberControlTester";
import objectControlTester from "./renderers/testers/objectControlTester";
import stringSelectControlTester from "./renderers/testers/stringSelectControlTester";
import textControlTester from "./renderers/testers/textControlTester";
import timestampControlTester from "./renderers/testers/timestampControlTester";
import verticalLayoutTester from "./renderers/testers/verticalLayoutTester";
import TextControl from "./renderers/TextControl";
import TimestampControl from "./renderers/TimestampControl";
import VerticalLayout from "./renderers/VerticalLayout";

export const mantineRenderers = [
  { renderer: ArrayControl, tester: arrayControlTester },
  { renderer: CheckboxControl, tester: checkboxControlTester },
  { renderer: NumberControl, tester: numberControlTester },
  { renderer: StringSelectControl, tester: stringSelectControlTester },
  { renderer: TextControl, tester: textControlTester },
  { renderer: TimestampControl, tester: timestampControlTester },
  { renderer: ObjectControl, tester: objectControlTester },
  { renderer: AnyOfControl, tester: anyOfTester },
  { renderer: VerticalLayout, tester: verticalLayoutTester },
];
