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
} from "../ResponsiveButton";
import { BadgeMinimalProps } from "../BadgeMinimal";
import BadgeGroup, { BadgeGroupProps } from "../BadgeGroup";
import { WidgetConfiguration } from "@/lib/types";

interface WidgetComponentsProps extends WidgetWrapperComponentsProps {
  wrapper?: Omit<WidgetWrapperProps, "widgetId">;
  loader?: LoaderProps;
  badgeGroup?: BadgeGroupProps;
}

interface WidgetProps {
  id: string;
  title: string;
  config?: Partial<Omit<WidgetConfiguration, "widgetId">>;
  badges?: (BadgeMinimalProps | ReactNode)[];
  buttons?: (ResponsiveButtonProps | ReactNode)[];
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
  loading,
  mt,
  componentsProps,
}: PropsWithChildren<WidgetProps>) {
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
        <Group gap="xs" wrap="nowrap">
          <Title order={1} size="h3" lineClamp={1}>
            {title}
          </Title>
          {badges !== undefined && (
            <BadgeGroup badges={badges} {...componentsProps?.badgeGroup} />
          )}
        </Group>
        <Group gap="xs" wrap="nowrap">
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
