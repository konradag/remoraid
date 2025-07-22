import {
  LayoutProps,
  OwnPropsOfControl,
  OwnPropsOfLayout,
  RankedTester,
} from "@jsonforms/core";
import { MantineSize } from "@mantine/core";
import { ComponentType } from "react";

export interface JSONFormsRenderer<RendererType> {
  tester: RankedTester;
  renderer: RendererType;
}
export type RemoraidControlRenderer = JSONFormsRenderer<
  ComponentType<OwnPropsOfControl>
>;
export type RemoraidLayoutRenderer = JSONFormsRenderer<
  ComponentType<LayoutProps & OwnPropsOfLayout>
>;
export type RemoraidRenderer = RemoraidControlRenderer | RemoraidLayoutRenderer;
export interface FormOptions {
  withDescriptions: boolean;
  gutter: MantineSize | number;
}
