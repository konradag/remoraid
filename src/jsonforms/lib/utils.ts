import { vanillaRenderers } from "@jsonforms/vanilla-renderers";
import { remoraidRenderers } from "@/jsonforms/renderers/index";
import { JSONFormsRenderer } from "./types";

export const renderers: JSONFormsRenderer<any>[] = [
  ...vanillaRenderers,
  ...remoraidRenderers,
];
