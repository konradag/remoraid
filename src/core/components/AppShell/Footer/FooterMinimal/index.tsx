import { Center } from "@mantine/core";
import { Icon, IconPennant, IconProps } from "@tabler/icons-react";
import { ReactNode } from "react";
import { useAppShellUserExperience } from "../../AppShellUserExperienceProvider";
import { merge } from "lodash";
import { FrameLayoutElementProps } from "@/core/components/FrameLayout/Element";
import PageContainer, {
  PageContainerProps,
} from "@/core/components/Page/PageContainer";
import { useRemoraidTheme } from "@/core/components/RemoraidProvider/ThemeProvider";
import { FrameLayoutSection } from "@/core/lib/types";
import FrameLayout from "@/core/components/FrameLayout";

export interface FooterMinimalProps {
  icon?: Icon;
  componentsProps?: {
    layoutElement?: Partial<FrameLayoutElementProps>;
    container?: Partial<PageContainerProps>;
    icon?: Partial<IconProps>;
  };
}

export default function FooterMinimal({
  icon: Icon = IconPennant,
  componentsProps,
}: FooterMinimalProps): ReactNode {
  // Contexts
  const theme = useRemoraidTheme();
  const {
    userExperience: {
      footer: { position },
    },
  } = useAppShellUserExperience();

  // Helpers
  const content = (
    <PageContainer {...componentsProps?.container}>
      <Center>
        <Icon
          color="var(--mantine-color-default-border)"
          {...theme.componentsProps.icons.huge}
          {...componentsProps?.icon}
        />
      </Center>
    </PageContainer>
  );

  if (position === FrameLayoutSection.Bottom) {
    return (
      <FrameLayout.Element
        section={position}
        includeContainer={true}
        {...componentsProps?.layoutElement}
        componentsProps={merge(
          { container: { style: { order: -50 } } },
          componentsProps?.layoutElement?.componentsProps
        )}
      >
        {content}
      </FrameLayout.Element>
    );
  }
  if (position === FrameLayoutSection.Content) {
    return content;
  }
  return null;
}
