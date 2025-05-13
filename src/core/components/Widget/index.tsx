import {
  Center,
  Divider,
  Group,
  MantineSize,
  Loader,
  Title,
  LoaderProps,
} from "@mantine/core";
import { PropsWithChildren, ReactNode } from "react";
import WidgetWrapper, {
  WidgetWrapperComponentsProps,
  WidgetWrapperProps,
} from "./WidgetWrapper";
import ResponsiveButton, {
  isResponsiveButtonProps,
  ResponsiveButtonProps,
} from "@/core/components/ResponsiveButton";
import { BadgeMinimalProps } from "@/core/components/BadgeMinimal";
import BadgeGroup, { BadgeGroupProps } from "@/core/components/BadgeGroup";
import { WidgetConfiguration } from "@/core/lib/types";
import AlertMinimal, {
  AlertMinimalProps,
  isAlertMinimalProps,
} from "@/core/components/AlertMinimal";

interface WidgetComponentsProps extends WidgetWrapperComponentsProps {
  wrapper?: Partial<Omit<WidgetWrapperProps, "widgetId">>;
  loader?: Partial<LoaderProps>;
  badgeGroup?: Partial<BadgeGroupProps>;
}

interface WidgetProps {
  id: string;
  title: string;
  config?: Partial<Omit<WidgetConfiguration, "widgetId">>;
  badges?: (BadgeMinimalProps | ReactNode)[];
  buttons?: (ResponsiveButtonProps | ReactNode)[];
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
              if (isResponsiveButtonProps(e)) {
                return <ResponsiveButton {...e} key={i} />;
              }
              return e;
            })}
        </Group>
      </Group>
      <Divider my="md" />
      {alerts !== undefined &&
        alerts.map((a, i) => {
          if (isAlertMinimalProps(a)) {
            return <AlertMinimal {...a} mb={alertsGap} key={i} />;
          }
          return a;
        })}
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
