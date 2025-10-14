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
  TitleProps,
  Box,
  ScrollArea,
  ScrollAreaAutosizeProps,
  Transition,
  Text,
  TextProps,
} from "@mantine/core";
import { Children, PropsWithChildren, ReactNode } from "react";
import WidgetWrapper, { WidgetWrapperProps } from "./WidgetWrapper";
import BadgeMinimal from "@/core/components/BadgeMinimal";
import BadgeGroup, { BadgeGroupProps } from "@/core/components/BadgeGroup";
import { WidgetConfiguration } from "@/core/lib/types";
import AlertMinimal from "@/core/components/AlertMinimal";
import RemoraidButton, { RemoraidButtonProps } from "../RemoraidButton";
import {
  asElementOrPropsOfType,
  ElementOrPropsOfType,
  isValidElementOfType,
} from "@/core/lib/utils";
import clsx from "clsx";
import { merge } from "lodash";

export interface WidgetProps {
  id: string;
  title?: string;
  description?: string;
  config?: Partial<Omit<WidgetConfiguration, "widgetId">>;
  badges?: ElementOrPropsOfType<typeof BadgeMinimal>[];
  buttons?: ElementOrPropsOfType<
    typeof RemoraidButton,
    RemoraidButtonProps<true> | RemoraidButtonProps<false>
  >[];
  alerts?: ElementOrPropsOfType<typeof AlertMinimal>[];
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
    contentContainer?: Partial<StackProps>;
    childrenContainer?: Partial<ScrollAreaAutosizeProps>;
    loader?: Partial<LoaderProps>;
    title?: Partial<TitleProps>;
    description?: Partial<TextProps>;
    badgeGroup?: Partial<BadgeGroupProps>;
    divider?: Partial<DividerProps>;
    alertsContainer?: Partial<StackProps>;
  };
}

export default function Widget({
  id,
  title,
  description,
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
      <Stack gap="md" mih={0} {...componentsProps?.contentContainer}>
        <Group justify="space-between" wrap="nowrap">
          <Stack gap={4}>
            <Group gap={badgesGap} wrap="nowrap">
              <Title
                order={1}
                size="h2"
                lineClamp={1}
                {...componentsProps?.title}
              >
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
            <Transition mounted={Boolean(description)}>
              {(transitionStyle) => (
                <Text
                  size="sm"
                  c="dimmed"
                  {...componentsProps?.description}
                  style={merge(
                    transitionStyle,
                    componentsProps?.description?.style
                  )}
                >
                  {description}
                </Text>
              )}
            </Transition>
          </Stack>
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
        <Box>
          <Divider {...componentsProps?.divider} />
        </Box>
        <Stack
          align="stretch"
          gap={alertsGap}
          {...componentsProps?.alertsContainer}
          className={clsx(
            "hide-if-empty",
            componentsProps?.alertsContainer?.className
          )}
        >
          {alerts?.map((alert, i) => {
            if (isValidElementOfType(AlertMinimal, alert)) {
              return alert;
            }
            return <AlertMinimal {...alert} key={i} />;
          })}
        </Stack>
        {(loading || Children.toArray(children).length > 0) && (
          <ScrollArea.Autosize
            flex={1}
            {...componentsProps?.childrenContainer}
            className={clsx(
              "remoraid-widget-children-container",
              componentsProps?.childrenContainer?.className
            )}
          >
            {loading ? (
              <Center>
                <Loader {...componentsProps?.loader} />
              </Center>
            ) : (
              children
            )}
          </ScrollArea.Autosize>
        )}
      </Stack>
    </WidgetWrapper>
  );
}
