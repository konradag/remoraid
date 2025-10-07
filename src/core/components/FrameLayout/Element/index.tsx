import { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import { Box, BoxProps, Portal } from "@mantine/core";
import {
  FrameLayoutSection,
  LayoutElementContext,
  LayoutType,
} from "@/core/lib/types";
import { useLayouts } from "../../RemoraidProvider/LayoutsProvider";
import { useFrameLayout } from "..";
import { InvalidComponentUsageError } from "@/core/lib/errors";
import PageContainer, { PageContainerProps } from "../../Page/PageContainer";
import { merge } from "lodash";
import clsx from "clsx";

const layoutElementContext =
  createContext<LayoutElementContext<LayoutType.Frame> | null>(null);

export const useFrameLayoutElement =
  (): LayoutElementContext<LayoutType.Frame> | null => {
    return useContext(layoutElementContext);
  };

export interface FrameLayoutElementProps {
  section: FrameLayoutSection;
  includeContainer?: boolean;
  includePageContainer?: boolean;
  layoutId?: string;
  hidden?: boolean;
  componentsProps?: {
    container?: Partial<BoxProps>;
    PageContainer?: Partial<PageContainerProps>;
  };
}

export default function Element({
  section,
  includeContainer = true,
  includePageContainer = false,
  layoutId,
  hidden = false,
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
  if (!layout.sections[section]) {
    return null;
  }
  let containerProps: Partial<BoxProps> = {};
  if (
    section === FrameLayoutSection.Left ||
    section === FrameLayoutSection.Right
  ) {
    containerProps.h = "100%";
  }
  const element = includePageContainer ? (
    <PageContainer p={0} hidden={hidden} {...componentsProps?.PageContainer}>
      {children}
    </PageContainer>
  ) : (
    children
  );

  return (
    <Portal target={layout.sections[section]}>
      <layoutElementContext.Provider
        value={{ layoutType: LayoutType.Frame, section }}
      >
        {includeContainer ? (
          <Box
            data-hidden={hidden}
            {...merge(containerProps, componentsProps?.container)}
            className={clsx(
              "remoraid-frame-layout-element",
              containerProps?.className,
              componentsProps?.container?.className
            )}
          >
            {element}
          </Box>
        ) : (
          element
        )}
      </layoutElementContext.Provider>
    </Portal>
  );
}
