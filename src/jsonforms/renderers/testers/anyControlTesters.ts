import {
  rankWith,
  RankedTester,
  isControl,
  and,
  uiTypeIs,
  schemaTypeIs,
  Resolve,
} from "@jsonforms/core";

const testers: RankedTester[] = [
  rankWith(5, isControl),
  rankWith(
    15,
    and(
      and(uiTypeIs("Control"), schemaTypeIs("object")),
      (uischema, schema, ctx) => {
        if (!isControl(uischema)) {
          return false;
        }
        const resolvedSchema = Resolve.schema(
          schema,
          uischema.scope,
          ctx.rootSchema
        );
        const hasProperties =
          resolvedSchema.properties &&
          Object.keys(resolvedSchema.properties).length > 0;
        const hasAdditionalProperties =
          resolvedSchema.additionalProperties === true ||
          (resolvedSchema.additionalProperties !== undefined &&
            Object.keys(resolvedSchema.additionalProperties).length > 0);
        return !hasProperties && !hasAdditionalProperties;
      }
    )
  ),
];

export default testers;
