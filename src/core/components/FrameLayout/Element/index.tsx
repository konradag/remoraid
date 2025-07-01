import { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { Box, BoxProps, Portal } from "@mantine/core";
import { FrameLayoutSection, LayoutType } from "@/core/lib/types";
import { useLayouts } from "../../RemoraidProvider/LayoutsProvider";
import { useFrameLayout } from "..";
import { InvalidComponentUsageError } from "@/core/lib/errors";

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
  if (!closestLayout) {
    throw new InvalidComponentUsageError(
      "FrameLayout.Element",
      "must be used as child of 'FrameLayout'."
    );
  }

  // Helpers
  const layout = layouts[layoutId ?? closestLayout.layoutId];
  if (!layout) {
    return null;
  }
  if (layout.type !== LayoutType.Frame) {
    throw new TypeError(
      "Prop 'layoutId' in 'FrameLayout.Element' must refer to a valid 'FrameLayout' component. Leave 'layoutId' undefined, if you want to use the closest 'FrameLayout' as reference layout."
    );
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
