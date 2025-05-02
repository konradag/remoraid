import {
  Badge,
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
        {badges.map((e) => {
          if (isBadgeMinimalProps(e)) {
            return <BadgeMinimal {...e} />;
          }
          return e;
        })}
      </Group>
      <Tooltip
        label={`${numVisibleBadges} badges`}
        {...componentsProps?.tooltip}
      >
        <Badge
          hiddenFrom={breakpoint || theme.breakpoints.badgeGroupCollapse}
          variant="default"
          circle
        >
          {numVisibleBadges}
        </Badge>
      </Tooltip>
    </>
  );
}
