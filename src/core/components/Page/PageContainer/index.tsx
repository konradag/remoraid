import { Container, ContainerProps, MantineSize } from "@mantine/core";
import { PropsWithChildren, ReactNode } from "react";
import { useRemoraidTheme } from "../../RemoraidProvider/ThemeProvider";

export interface PageContainerProps {
  pt?: MantineSize | number;
  componentsProps?: { container?: ContainerProps };
}

export default function PageContainer({
  children,
  pt = 0,
  componentsProps,
}: PropsWithChildren<PageContainerProps>): ReactNode {
  const theme = useRemoraidTheme();

  return (
    <Container
      size={theme.containerSize}
      pt={pt}
      {...componentsProps?.container}
    >
      {children}
    </Container>
  );
}
