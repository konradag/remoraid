import {
  Center,
  Divider,
  Group,
  MantineSize,
  Loader,
  Title,
  LoaderProps,
  DividerProps,
  Stack,
  StackProps,
} from "@mantine/core";
import { ComponentProps, PropsWithChildren, ReactNode } from "react";
import WidgetWrapper, { WidgetWrapperProps } from "./WidgetWrapper";
import BadgeMinimal from "@/core/components/BadgeMinimal";
import BadgeGroup, { BadgeGroupProps } from "@/core/components/BadgeGroup";
import { WidgetConfiguration } from "@/core/lib/types";
import AlertMinimal from "@/core/components/AlertMinimal";
import RemoraidButton, { RemoraidButtonProps } from "../RemoraidButton";
import {
  asElementOrPropsOfType,
  ElementOfType,
  isValidElementOfType,
} from "@/core/lib/utils";

export interface WidgetProps {
  id: string;
  title?: string;
  config?: Partial<Omit<WidgetConfiguration, "widgetId">>;
  badges?: (
    | ComponentProps<typeof BadgeMinimal>
    | ElementOfType<typeof BadgeMinimal>
  )[];
  buttons?: (
    | RemoraidButtonProps<true>
    | RemoraidButtonProps<false>
    | ElementOfType<
        typeof RemoraidButton,
        RemoraidButtonProps<true> | RemoraidButtonProps<false>
      >
  )[];
  alerts?: (
    | ComponentProps<typeof AlertMinimal>
    | ElementOfType<typeof AlertMinimal>
  )[];
  gaps?:
    | MantineSize
    | number
    | {
        badges?: MantineSize | number;
        buttons?: MantineSize | number;
        alerts?: MantineSize | number;
      };
  loading?: boolean;
  mt?: MantineSize | number;
  pinnableSection?: WidgetWrapperProps["pinnableSection"];
  componentsProps?: {
    wrapper?: Partial<Omit<WidgetWrapperProps, "config">>;
    loader?: Partial<LoaderProps>;
    badgeGroup?: Partial<BadgeGroupProps>;
    divider?: Partial<DividerProps>;
    alertsContainer?: Partial<StackProps>;
  };
}

export default function Widget({
  id,
  title,
  config,
  badges: badgesProp,
  buttons: buttonsProp,
  alerts: alertsProp,
  gaps,
  loading,
  mt,
  pinnableSection,
  componentsProps,
  children,
}: PropsWithChildren<WidgetProps>): ReactNode {
  // Type safety
  const buttons = buttonsProp?.map((button) =>
    asElementOrPropsOfType<
      typeof RemoraidButton,
      RemoraidButtonProps<true> | RemoraidButtonProps<false>
    >(RemoraidButton, button, "Check the 'buttons' property of this widget.")
  );
  const alerts = alertsProp?.map((alert) =>
    asElementOrPropsOfType(
      AlertMinimal,
      alert,
      "Check the 'alerts' property of this widget."
    )
  );
  const badges = badgesProp?.map((badge) =>
    asElementOrPropsOfType(
      BadgeMinimal,
      badge,
      "Check the 'badges' property of this widget."
    )
  );

  // Helpers
  const badgesGap = (typeof gaps === "object" ? gaps.badges : gaps) ?? "xs";
  const buttonsGap = (typeof gaps === "object" ? gaps.buttons : gaps) ?? "xs";
  const alertsGap = (typeof gaps === "object" ? gaps.alerts : gaps) ?? "xs";

  return (
    <WidgetWrapper
      config={{
        widgetId: id,
        ...config,
        initialValues: {
          name: title,
          ...config?.initialValues,
        },
      }}
      mt={mt}
      {...componentsProps?.wrapper}
      pinnableSection={
        pinnableSection ?? componentsProps?.wrapper?.pinnableSection
      }
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap={badgesGap} wrap="nowrap">
          <Title order={1} size="h3" lineClamp={1}>
            {title ?? id}
          </Title>
          {badges !== undefined && (
            <BadgeGroup
              badges={badges}
              gap={badgesGap}
              {...componentsProps?.badgeGroup}
            />
          )}
        </Group>
        <Group gap={buttonsGap} wrap="nowrap">
          {buttons !== undefined &&
            buttons.map((button, i) => {
              if (isValidElementOfType(RemoraidButton, button)) {
                return button;
              }
              return <RemoraidButton {...button} key={i} />;
            })}
        </Group>
      </Group>
      <Divider my="md" {...componentsProps?.divider} />
      <Stack
        align="stretch"
        gap={alertsGap}
        mb={alerts && alerts.length > 0 ? "md" : 0}
        {...componentsProps?.alertsContainer}
      >
        {alerts?.map((alert, i) => {
          if (isValidElementOfType(AlertMinimal, alert)) {
            return alert;
          }
          return <AlertMinimal {...alert} key={i} />;
        })}
      </Stack>
      {loading ? (
        <Center>
          <Loader {...componentsProps?.loader} />
        </Center>
      ) : (
        <>{children}</>
      )}
    </WidgetWrapper>
  );
}
