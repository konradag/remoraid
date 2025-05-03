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
import BadgeMinimal, {
  BadgeMinimalProps,
  isBadgeMinimalProps,
} from "../BadgeMinimal";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";

export interface BadgeGroupProps {
  badges: (BadgeMinimalProps | ReactNode)[];
  gap?: MantineSize | number;
  breakpoint?: MantineBreakpoint;
  componentsProps?: {
    tooltip?: TooltipProps;
    cumulativeBadge?: Omit<BadgeProps, "hiddenFrom" | "circle">;
  };
}

export default function BadgeGroup({
  badges,
  gap,
  breakpoint,
  componentsProps,
}: BadgeGroupProps) {
  // Style
  const theme = useRemoraidTheme();

  // Helpers
  const numVisibleBadges = badges.filter((e) =>
    isBadgeMinimalProps(e) ? e.mounted !== false : true
  ).length;

  if (numVisibleBadges === 0) {
    return <></>;
  }

  return (
    <>
      <Group
        gap={gap || "xs"}
        wrap="nowrap"
        visibleFrom={breakpoint || theme.breakpoints.badgeGroupCollapse}
      >
        {badges.map((e, i) => {
          if (isBadgeMinimalProps(e)) {
            return <BadgeMinimal {...e} key={i} />;
          }
          return e;
        })}
      </Group>
      <Tooltip
        label={`${numVisibleBadges} Badges`}
        {...componentsProps?.tooltip}
      >
        <Badge
          hiddenFrom={breakpoint || theme.breakpoints.badgeGroupCollapse}
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
