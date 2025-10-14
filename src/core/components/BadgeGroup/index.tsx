import {
  Badge,
  BadgeProps,
  Group,
  GroupProps,
  HoverCard,
  HoverCardProps,
  MantineBreakpoint,
  MantineSize,
  Stack,
  StackProps,
  Transition,
  TransitionProps,
} from "@mantine/core";
import React, { ReactNode } from "react";
import BadgeMinimal from "../BadgeMinimal";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import {
  asElementOrPropsOfType,
  ElementOrPropsOfType,
  isValidElementOfType,
} from "@/core/lib/utils";
import { merge } from "lodash";
import clsx from "clsx";

export interface BadgeGroupProps {
  badges: ElementOrPropsOfType<typeof BadgeMinimal>[];
  gap?: MantineSize | number;
  breakpoint?: MantineBreakpoint;
  componentsProps?: {
    container?: Partial<Omit<GroupProps, "visibleFrom">>;
    HoverCard?: Partial<HoverCardProps>;
    hoverContainer?: Partial<StackProps>;
    cumulativeBadge?: Partial<Omit<BadgeProps, "hiddenFrom">>;
    cumulativeBadgeTransition?: Partial<TransitionProps>;
  };
}

export default function BadgeGroup({
  badges: badgesProp,
  gap = "xs",
  breakpoint: breakpointProp,
  componentsProps,
}: BadgeGroupProps): ReactNode {
  // Type safety
  const badges = badgesProp.map((badge) =>
    asElementOrPropsOfType(
      BadgeMinimal,
      badge,
      "Check 'badges' property passed to 'BadgeGroup'."
    )
  );

  // Contexts
  const theme = useRemoraidTheme();

  // Props default values
  const breakpoint = breakpointProp ?? theme.breakpoints.badgeGroupCollapse;

  // Helpers
  const numVisibleBadges = badges.filter((badge) =>
    isValidElementOfType(BadgeMinimal, badge)
      ? badge.props.mounted
      : badge.mounted !== false
  ).length;
  const badgesElement = badges.map((badge, i) => {
    if (isValidElementOfType(BadgeMinimal, badge)) {
      return badge;
    }
    return <BadgeMinimal {...badge} key={i} />;
  });

  return (
    <>
      <Group
        gap={gap}
        wrap="nowrap"
        visibleFrom={numVisibleBadges > 1 ? breakpoint : undefined}
        {...componentsProps?.container}
        className={clsx("hide-if-empty", componentsProps?.container?.className)}
      >
        {badgesElement}
      </Group>
      <Transition
        mounted={numVisibleBadges > 1}
        transition="fade"
        duration={theme.transitionDurations.short}
        timingFunction="ease"
        {...componentsProps?.cumulativeBadgeTransition}
      >
        {(transitionStyle) => (
          <HoverCard {...componentsProps?.HoverCard}>
            <HoverCard.Target>
              <Badge
                hiddenFrom={breakpoint}
                variant="dot"
                {...componentsProps?.cumulativeBadge}
                style={{
                  cursor: "pointer",
                  ...merge(
                    transitionStyle,
                    componentsProps?.cumulativeBadge?.style
                  ),
                }}
              >
                {numVisibleBadges} badges
              </Badge>
            </HoverCard.Target>
            <HoverCard.Dropdown p={gap}>
              <Stack gap={gap} {...componentsProps?.hoverContainer}>
                {badgesElement}
              </Stack>
            </HoverCard.Dropdown>
          </HoverCard>
        )}
      </Transition>
    </>
  );
}
