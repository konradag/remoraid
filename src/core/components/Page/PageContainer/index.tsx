import { Container, ContainerProps, MantineSize } from "@mantine/core";
import { PropsWithChildren, ReactNode } from "react";
import { useRemoraidTheme } from "../../RemoraidProvider/ThemeProvider";

interface PageContainerProps {
  pt?: MantineSize | number;
  componentsProps?: { container?: ContainerProps };
}

export default function PageContainer({
  children,
  pt,
  componentsProps,
}: PropsWithChildren<PageContainerProps>): ReactNode {
  const theme = useRemoraidTheme();

  return (
    <Container
      size={theme.containerSize}
      pt={pt ?? "md"}
      {...componentsProps?.container}
    >
      {children}
    </Container>
  );
}
