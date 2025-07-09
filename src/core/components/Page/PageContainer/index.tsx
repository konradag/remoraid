import { Container, ContainerProps, MantineSize } from "@mantine/core";
import { PropsWithChildren, ReactNode } from "react";
import { useRemoraidTheme } from "../../RemoraidProvider/ThemeProvider";
import clsx from "clsx";

export interface PageContainerProps {
  p?: MantineSize | number;
  componentsProps?: { container?: ContainerProps };
}

export default function PageContainer({
  children,
  p = 0,
  componentsProps,
}: PropsWithChildren<PageContainerProps>): ReactNode {
  const theme = useRemoraidTheme();

  return (
    <Container
      size={theme.containerSize}
      p={p}
      w="100%"
      {...componentsProps?.container}
      className={clsx(
        "remoraid-page-container",
        componentsProps?.container?.className
      )}
    >
      {children}
    </Container>
  );
}
