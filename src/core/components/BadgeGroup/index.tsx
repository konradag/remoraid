import {
  Badge,
  BadgeProps,
  Group,
  MantineBreakpoint,
  MantineSize,
  Tooltip,
  TooltipProps,
} from "@mantine/core";
import React, { ReactNode } from "react";
import BadgeMinimal, { BadgeMinimalProps } from "../BadgeMinimal";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { ElementOfType, isValidElementOfType } from "@/core/lib/utils";

export interface BadgeGroupProps {
  badges: (BadgeMinimalProps | ElementOfType<typeof BadgeMinimal>)[];
  gap?: MantineSize | number;
  breakpoint?: MantineBreakpoint;
  componentsProps?: {
    tooltip?: Partial<TooltipProps>;
    cumulativeBadge?: Partial<Omit<BadgeProps, "hiddenFrom" | "circle">>;
  };
}

export default function BadgeGroup({
  badges,
  gap,
  breakpoint,
  componentsProps,
}: BadgeGroupProps): ReactNode {
  // Style
  const theme = useRemoraidTheme();

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
