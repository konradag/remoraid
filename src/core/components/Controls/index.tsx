import { asChildrenOfType, PropsWithChildrenOfType } from "@/core/lib/utils";
import ControlButton from "./ControlButton";
import { ReactNode, RefObject, useRef, useState } from "react";
import {
  Group,
  GroupProps,
  MantineSize,
  Paper,
  PaperProps,
  Transition,
  TransitionProps,
} from "@mantine/core";
import { RemoraidIconSize } from "@/core/lib/types";
import { IconGripHorizontal, IconProps } from "@tabler/icons-react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import clsx from "clsx";
import { merge } from "lodash";

export interface ControlsProps {
  dragContainerRef: RefObject<HTMLDivElement | null>;
  mounted?: boolean;
  groupRef?: RefObject<HTMLDivElement | null>;
  gutter?: MantineSize | number;
  iconSize?: RemoraidIconSize;
  componentsProps?: {
    group?: Partial<GroupProps>;
    container?: Partial<PaperProps>;
    transition?: Partial<TransitionProps>;
    gripIcon?: Partial<IconProps>;
  };
}

export default function Controls({
  groupRef,
  mounted = true,
  dragContainerRef,
  gutter = 5,
  iconSize = RemoraidIconSize.Tiny,
  componentsProps,
  children: childrenProp,
}: PropsWithChildrenOfType<typeof ControlButton, ControlsProps>): ReactNode {
  // Type safety
  const children = asChildrenOfType(
    ControlButton,
    childrenProp,
    "Check children passed to 'Controls' component."
  );

  // Contexts
  const theme = useRemoraidTheme();

  // State
  const [pos, setPos] = useState<{ x: number | string; y: number | string }>({
    x: "100%",
    y: 0,
  });

  // Helpers
  const offsetRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const clamp = (v: number, min: number, max: number): number => {
    return Math.min(Math.max(v, min), max);
  };
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) {
      return;
    }
    const paperRect = containerRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - paperRect.left,
      y: e.clientY - paperRect.top,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
      return;
    }
    if (!containerRef.current || !dragContainerRef.current) {
      return;
    }
    const boxRect = dragContainerRef.current.getBoundingClientRect();
    const paperRect = containerRef.current.getBoundingClientRect();
    const rawX = e.clientX - boxRect.left - offsetRef.current.x;
    const rawY = e.clientY - boxRect.top - offsetRef.current.y;
    const maxX = boxRect.width - paperRect.width;
    const maxY = boxRect.height - paperRect.height;
    setPos({
      x: clamp(rawX, 0, maxX),
      y: clamp(rawY, 0, maxY),
    });
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <Transition
      mounted={mounted}
      keepMounted
      transition={pos.x === "100%" ? "fade-left" : "fade"}
      duration={theme.transitionDurations.short}
      timingFunction="ease"
      {...componentsProps?.transition}
    >
      {(transitionStyle) => (
        <Paper
          ref={containerRef}
          pos="absolute"
          p={gutter}
          bg={theme.transparentBackground}
          shadow="md"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          {...componentsProps?.container}
          style={{
            left: pos.x,
            top: pos.y,
            transform: pos.x === "100%" ? "translateX(-100%)" : undefined,
            ...merge(transitionStyle, componentsProps?.container?.style),
          }}
          className={clsx(
            "remoraid-controls",
            componentsProps?.container?.className
          )}
        >
          <Group
            gap={gutter}
            ref={groupRef}
            wrap="nowrap"
            {...componentsProps?.group}
            className={clsx(
              "remoraid-controls-group",
              componentsProps?.group?.className
            )}
          >
            <IconGripHorizontal
              order={100}
              color="var(--mantine-color-default-border)"
              {...merge(theme.iconProps[iconSize], componentsProps?.gripIcon)}
            />
            {children}
          </Group>
        </Paper>
      )}
    </Transition>
  );
}
