import {
  PropsWithChildren,
  ReactNode,
  RefObject,
  useMemo,
  useState,
} from "react";
import { useLayouts } from "../RemoraidProvider/LayoutsProvider";
import AppShell, { remoraidAppShellLayoutId } from "../AppShell";
import { LayoutContext, LayoutType } from "@/core/lib/types";
import { OptionalIfExtends } from "@/core/lib/utils";
import FrameLayout from "../FrameLayout";
import ControlButton, { ControlButtonProps } from "../ControlButton";
import { IconPin, IconPinnedOff } from "@tabler/icons-react";
import { Box, BoxProps, Group, GroupProps, Portal } from "@mantine/core";
import clsx from "clsx";
import {
  FrameLayoutElementProps,
  isFrameLayoutElementSection,
} from "../FrameLayout/Element";

export type PinnableDefaultLayoutType = LayoutType.Frame;

interface ExplicitPinnableProps<T extends LayoutType> {
  layoutType: T;
  section: keyof LayoutContext<T>["sections"];
  initialValue?: boolean;
  layoutId?: string;
  controlsContainer?: RefObject<HTMLDivElement | null>;
  componentsProps?: {
    controlsContainer?: Partial<GroupProps>;
    button?: Partial<ControlButtonProps>;
    container?: Partial<BoxProps>;
    layoutElement?: Partial<FrameLayoutElementProps>;
  };
}

export type PinnableProps<T extends LayoutType = PinnableDefaultLayoutType> =
  OptionalIfExtends<
    ExplicitPinnableProps<T>,
    "layoutType",
    PinnableDefaultLayoutType,
    T
  >;

export default function Pinnable<
  T extends LayoutType = PinnableDefaultLayoutType
>({
  layoutType: layoutTypeProp,
  section,
  initialValue = false,
  layoutId,
  controlsContainer,
  componentsProps,
  children,
}: PropsWithChildren<PinnableProps<T>>): ReactNode {
  // Props default values
  const layoutType =
    layoutTypeProp ?? (LayoutType.Frame satisfies PinnableDefaultLayoutType);

  // Contexts
  const { layouts } = useLayouts();

  // State
  const [pinned, setPinned] = useState<boolean>(initialValue);

  // Helpers
  const layout = layouts[layoutId ?? remoraidAppShellLayoutId];
  if (layout && layout.type !== layoutType) {
    throw new TypeError(
      `Prop 'layoutId' in '${Pinnable.name}' refers to a layout of type ${layout.type}, expected ${layoutType}. Leave 'layoutId' undefined, if you want to use the layout in '${AppShell.name}' as reference layout.`
    );
  }
  const controlButton = useMemo(
    () => (
      <ControlButton
        icon={pinned ? IconPinnedOff : IconPin}
        color="green"
        {...componentsProps?.button}
        onClick={() => {
          setPinned((p) => !p);
          componentsProps?.button?.onClick?.();
        }}
      />
    ),
    [pinned, componentsProps?.button]
  );
  const element = (
    <Box {...componentsProps?.container}>
      {controlsContainer === undefined ? (
        <Group
          gap="xs"
          {...componentsProps?.controlsContainer}
          className={clsx(
            "remoraid-controls",
            componentsProps?.controlsContainer?.className
          )}
        >
          {controlButton}
        </Group>
      ) : (
        controlsContainer.current !== null && (
          <Portal target={controlsContainer.current}>{controlButton}</Portal>
        )
      )}
      {children}
    </Box>
  );

  if (!layout) {
    return null;
  }
  if (
    pinned &&
    layoutType === LayoutType.Frame &&
    isFrameLayoutElementSection(section)
  ) {
    return (
      <FrameLayout.Element
        layoutId={layoutId}
        section={section}
        {...componentsProps?.layoutElement}
        componentsProps={{
          ...componentsProps?.layoutElement?.componentsProps,
          container: {
            pos: "relative",
            ...componentsProps?.layoutElement?.componentsProps?.container,
          },
        }}
      >
        {element}
      </FrameLayout.Element>
    );
  }
  return element;
}
