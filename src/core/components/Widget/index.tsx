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
import { PropsWithChildren, ReactNode } from "react";
import WidgetWrapper, {
  WidgetWrapperComponentsProps,
  WidgetWrapperProps,
} from "./WidgetWrapper";
import { BadgeMinimalProps } from "@/core/components/BadgeMinimal";
import BadgeGroup, { BadgeGroupProps } from "@/core/components/BadgeGroup";
import { WidgetConfiguration } from "@/core/lib/types";
import AlertMinimal, {
  AlertMinimalProps,
  isAlertMinimalProps,
} from "@/core/components/AlertMinimal";
import RemoraidButton, {
  isRemoraidButtonProps,
  RemoraidButtonProps,
} from "../RemoraidButton";

interface WidgetComponentsProps extends WidgetWrapperComponentsProps {
  wrapper?: Partial<Omit<WidgetWrapperProps, "widgetId">>;
  loader?: Partial<LoaderProps>;
  badgeGroup?: Partial<BadgeGroupProps>;
  divider?: Partial<DividerProps>;
  alertsContainer?: Partial<StackProps>;
}

export interface WidgetProps {
  id: string;
  title: string;
  config?: Partial<Omit<WidgetConfiguration, "widgetId">>;
  badges?: (BadgeMinimalProps | ReactNode)[];
  buttons?: (RemoraidButtonProps | ReactNode)[];
  alerts?: (AlertMinimalProps | ReactNode)[];
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
  componentsProps?: WidgetComponentsProps;
}

export default function Widget({
  children,
  id,
  config,
  title,
  badges,
  buttons,
  alerts,
  gaps,
  loading,
  mt,
  componentsProps,
}: PropsWithChildren<WidgetProps>): ReactNode {
  // Helpers
  const badgesGap = (typeof gaps === "object" ? gaps.badges : gaps) ?? "xs";
  const buttonsGap = (typeof gaps === "object" ? gaps.buttons : gaps) ?? "xs";
  const alertsGap = (typeof gaps === "object" ? gaps.alerts : gaps) ?? "xs";

  return (
    <WidgetWrapper
      config={{
        widgetId: id,
        name: title,
        ...config,
      }}
      mt={mt}
      componentsProps={{
        container: componentsProps?.container,
        transition: componentsProps?.transition,
      }}
      {...componentsProps?.wrapper}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap={badgesGap} wrap="nowrap">
          <Title order={1} size="h3" lineClamp={1}>
            {title}
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
            buttons.map((e, i) => {
              if (isRemoraidButtonProps(e)) {
                return <RemoraidButton {...e} key={i} />;
              }
              return e;
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
        {alerts?.map((a, i) => {
          if (isAlertMinimalProps(a)) {
            return <AlertMinimal {...a} key={i} />;
          }
          return a;
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
