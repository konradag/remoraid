import {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLayouts } from "../RemoraidProvider/LayoutsProvider";
import AppShell, { remoraidAppShellLayoutId } from "../AppShell";
import { LayoutSection, LayoutType } from "@/core/lib/types";
import { OptionalIfExtends } from "@/core/lib/utils";
import FrameLayout from "../FrameLayout";
import { IconPin, IconPinnedOff } from "@tabler/icons-react";
import { Box, Portal } from "@mantine/core";
import { FrameLayoutElementProps } from "../FrameLayout/Element";
import Controls, { ControlsProps } from "../Controls";
import ControlButton, { ControlButtonProps } from "../Controls/ControlButton";
import clsx from "clsx";

export type PinnableDefaultLayoutType = LayoutType.Frame;

interface ExplicitPinnableProps<T extends LayoutType> {
  layoutType: T;
  section: LayoutSection<T>;
  initialValue?: boolean;
  layoutId?: string;
  controlsContainer?: HTMLDivElement | null;
  hidden?: boolean;
  componentsProps?: {
    controls?: Partial<ControlsProps>;
    button?: Partial<ControlButtonProps>;
    container?: Partial<ComponentProps<typeof Box<"div">>>;
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
  hidden = false,
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
  const containerRef = useRef<HTMLDivElement | null>(null);
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
        tooltip={pinned ? "Unpin" : "Pin"}
        color="green"
        order={100}
        {...componentsProps?.button}
        onClick={(e) => {
          setPinned((p) => !p);
          componentsProps?.button?.onClick?.(e);
        }}
      />
    ),
    [pinned, componentsProps?.button]
  );
  const element = (
    <Box
      pos="relative"
      ref={containerRef}
      data-hidden={hidden}
      {...componentsProps?.container}
      className={clsx(
        "remoraid-pinnable",
        componentsProps?.container?.className
      )}
    >
      {controlsContainer === undefined ? (
        <Controls
          dragContainerRef={containerRef}
          {...componentsProps?.controls}
        >
          {controlButton}
        </Controls>
      ) : (
        controlsContainer !== null && (
          <Portal target={controlsContainer}>{controlButton}</Portal>
        )
      )}
      {children}
    </Box>
  );

  if (!layout) {
    return null;
  }
  if (pinned && layoutType === LayoutType.Frame) {
    return (
      <FrameLayout.Element
        layoutId={layoutId}
        section={section}
        hidden={hidden}
        {...componentsProps?.layoutElement}
      >
        {element}
      </FrameLayout.Element>
    );
  }
  return element;
}
