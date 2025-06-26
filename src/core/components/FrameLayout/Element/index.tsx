import { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { Box, BoxProps, Portal } from "@mantine/core";
import { FrameLayoutSection, Layout, LayoutType } from "@/core/lib/types";
import { useLayouts } from "../../RemoraidProvider/LayoutsProvider";
import { isFrameLayout, useFrameLayout } from "..";

export interface FrameLayoutElementProps {
  section: Exclude<FrameLayoutSection, FrameLayoutSection.Content>;
  includeContainer?: boolean;
  layoutId?: string;
  componentsProps?: {
    container?: Partial<BoxProps>;
  };
}

export default function Element({
  section,
  includeContainer = true,
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
  let containerProps: Partial<BoxProps> = {};
  if (
    section === FrameLayoutSection.Left ||
    section === FrameLayoutSection.Right
  ) {
    containerProps.h = "100%";
  }

  return (
    <Portal target={layout.sections[section]}>
      {includeContainer ? (
        <Box {...containerProps} {...componentsProps?.container}>
          {children}
        </Box>
      ) : (
        children
      )}
    </Portal>
  );
}

export const isFrameLayoutElementSection = (
  position: unknown
): position is ComponentProps<typeof Element>["section"] => {
  if (
    position === FrameLayoutSection.Bottom ||
    position === FrameLayoutSection.Top ||
    position === FrameLayoutSection.Left ||
    position === FrameLayoutSection.Right
  ) {
    return true;
  }
  return false;
};
