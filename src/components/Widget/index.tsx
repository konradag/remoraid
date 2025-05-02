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
import BadgeGroup from "../BadgeGroup";

interface WidgetComponentsProps extends WidgetWrapperComponentsProps {
  wrapper?: Omit<WidgetWrapperProps, "widgetId">;
  loader?: LoaderProps;
}

interface WidgetProps {
  id: string;
  title: string;
  badges?: (BadgeMinimalProps | ReactNode)[];
  buttons?: (ResponsiveButtonProps | ReactNode)[];
  loading?: boolean;
  mt?: MantineSize | number;
  componentsProps?: WidgetComponentsProps;
}

export default function Widget({
  children,
  id,
  title,
  badges,
  buttons,
  loading,
  mt,
  componentsProps,
}: PropsWithChildren<WidgetProps>) {
  return (
    <WidgetWrapper
      widgetId={id}
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
          {badges !== undefined && <BadgeGroup badges={badges} />}
        </Group>
        <Group gap="xs" wrap="nowrap">
          {buttons !== undefined &&
            buttons.map((e) => {
              if (isResponsiveButtonProps(e)) {
                return <ResponsiveButton {...e} />;
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
