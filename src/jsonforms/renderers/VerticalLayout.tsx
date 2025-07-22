"use client";

import React, { ComponentType, FunctionComponent, ReactNode } from "react";
import {
  LayoutProps,
  OwnPropsOfLayout,
  RendererProps,
  VerticalLayout,
} from "@jsonforms/core";
import { withJsonFormsLayoutProps } from "@jsonforms/react";
import {
  VanillaRendererProps,
  WithChildren,
} from "@jsonforms/vanilla-renderers";
import { JsonSchema, Layout } from "@jsonforms/core";
import { JsonFormsDispatch, useJsonForms } from "@jsonforms/react";
import { useFormOptions } from "../components/FormOptionsProvider";

export const JsonFormsLayout = ({
  className,
  children,
  visible,
}: RendererProps & VanillaRendererProps & WithChildren): ReactNode => {
  return (
    <div
      className={className}
      hidden={visible === undefined || visible === null ? false : !visible}
    >
      {children}
    </div>
  );
};

export interface RenderChildrenProps {
  layout: Layout;
  schema: JsonSchema;
  className: string;
  path: string;
}

export const renderChildren = (
  layout: Layout,
  schema: JsonSchema,
  className: string,
  path: string,
  enabled: boolean
): ReactNode => {
  const { renderers, cells } = useJsonForms();
  const { formOptions } = useFormOptions();

  // Helpers
  const gutter =
    typeof formOptions.gutter === "string"
      ? `var(--mantine-spacing-${formOptions.gutter})`
      : `${formOptions.gutter}px`;

  return layout.elements.map((child, index) => {
    return (
      <div
        className={className}
        key={`${path}-${index}`}
        style={{ marginTop: index === 0 ? 0 : gutter }}
      >
        <JsonFormsDispatch
          renderers={renderers}
          cells={cells}
          uischema={child}
          schema={schema}
          path={path}
          enabled={enabled}
        />
      </div>
    );
  });
};

export const VerticalLayoutRenderer = (props: RendererProps): ReactNode => {
  const { data: _data, ...otherProps } = props;
  // We don't hand over data to the layout renderer to avoid rerendering it with every data change
  return <VerticalLayoutRendererComponent {...otherProps} />;
};

const VerticalLayoutRendererComponent: FunctionComponent<RendererProps> =
  React.memo(function VerticalLayoutRendererComponent({
    schema,
    uischema,
    path,
    visible,
    enabled,
  }: // getStyle,
  // getStyleAsClassName,
  RendererProps) {
    const verticalLayout = uischema as VerticalLayout;
    const layoutClassName = "";
    const childClassNames = "";

    return (
      <JsonFormsLayout
        className={layoutClassName}
        uischema={uischema}
        schema={schema}
        visible={visible}
        enabled={enabled}
        path={path}
        // getStyle={getStyle}
        // getStyleAsClassName={getStyleAsClassName}
      >
        {renderChildren(verticalLayout, schema, childClassNames, path, enabled)}
      </JsonFormsLayout>
    );
  });

const VerticalLayout: ComponentType<LayoutProps & OwnPropsOfLayout> =
  withJsonFormsLayoutProps(VerticalLayoutRenderer, false);
export default VerticalLayout;
