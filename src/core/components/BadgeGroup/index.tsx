import {
  Badge,
  BadgeProps,
  Group,
  MantineBreakpoint,
  MantineSize,
  Tooltip,
  TooltipProps,
} from "@mantine/core";
import React, { ComponentProps, isValidElement, ReactNode } from "react";
import BadgeMinimal, { BadgeMinimalProps } from "../BadgeMinimal";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import {
  asElementOrPropsOfType,
  ElementOfType,
  isValidElementOfType,
} from "@/core/lib/utils";

export interface BadgeGroupProps {
  badges: (
    | ComponentProps<typeof BadgeMinimal>
    | ElementOfType<typeof BadgeMinimal>
  )[];
  gap?: MantineSize | number;
  breakpoint?: MantineBreakpoint;
  componentsProps?: {
    tooltip?: Partial<TooltipProps>;
    cumulativeBadge?: Partial<Omit<BadgeProps, "hiddenFrom" | "circle">>;
  };
}

export default function BadgeGroup({
  badges: badgesProp,
  gap,
  breakpoint,
  componentsProps,
}: BadgeGroupProps): ReactNode {
  const theme = useRemoraidTheme();

  // Type safety
  const badges = badgesProp.map((badge) =>
    asElementOrPropsOfType(
      BadgeMinimal,
      badge,
      "Check 'badges' property of this component."
    )
  );

  // Helpers
  const numVisibleBadges = badges.filter((badge) =>
    isValidElementOfType(BadgeMinimal, badge)
      ? badge.props.mounted
      : badge.mounted !== false
  ).length;

  return (
    <>
      <Group
        gap={gap ?? "xs"}
        wrap="nowrap"
        visibleFrom={breakpoint ?? theme.breakpoints.badgeGroupCollapse}
      >
        {badges.map((badge, i) => {
          if (isValidElementOfType(BadgeMinimal, badge)) {
            return badge;
          } else if (isValidElement(badge)) {
            throw new TypeError(
              `Expected React element of type ${
                BadgeMinimal.name
              }, but received type: ${
                typeof badge.type === "string"
                  ? badge.type
                  : badge.type?.name ?? "unknown"
              }. Check the 'badges' property of this widget.`
            );
          }
          return <BadgeMinimal {...badge} key={i} />;
        })}
      </Group>
      <Tooltip
        label={`${numVisibleBadges} badge${numVisibleBadges === 1 ? "" : "s"}`}
        {...componentsProps?.tooltip}
      >
        <Badge
          hiddenFrom={breakpoint ?? theme.breakpoints.badgeGroupCollapse}
          hidden={numVisibleBadges === 0}
          variant="light"
          circle
          style={{ cursor: "pointer" }}
          {...componentsProps?.cumulativeBadge}
        >
          {numVisibleBadges}
        </Badge>
      </Tooltip>
    </>
  );
}
