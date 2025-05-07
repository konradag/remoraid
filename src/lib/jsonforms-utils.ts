import { vanillaRenderers } from "@jsonforms/vanilla-renderers";
import { mantineRenderers } from "@/jsonforms/index";

export const renderers = [...vanillaRenderers, ...mantineRenderers];
