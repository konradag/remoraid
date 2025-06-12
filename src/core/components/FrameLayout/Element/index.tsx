import { PropsWithChildren, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Box, BoxProps } from "@mantine/core";
import { FrameLayoutSection, Layout, LayoutType } from "@/core/lib/types";
import { useLayouts } from "../../RemoraidProvider/LayoutsProvider";
import { isFrameLayout, useFrameLayout } from "..";

export interface FrameLayoutElementProps {
  section: FrameLayoutSection;
  layoutId?: string;
  componentsProps?: {
    container?: Partial<BoxProps>;
  };
}

export default function Element({
  section,
  layoutId,
  componentsProps,
  children,
}: PropsWithChildren<FrameLayoutElementProps>): ReactNode {
  const { layouts } = useLayouts();
  const closestLayout = useFrameLayout();
  if (closestLayout.layoutId === null) {
    return null;
  }

  // Helpers
  const layout: Layout<LayoutType> =
    layouts[layoutId ?? closestLayout.layoutId];

  if (!isFrameLayout(layout)) {
    return null;
  }
  if (layout.sections[section] === null) {
    return null;
  }
  return createPortal(
    <Box {...componentsProps?.container}>{children}</Box>,
    layout.sections[section]
  );
}
