import { ReactNode, useState } from "react";
import NavbarMinimalContent, {
  NavbarMinimalContentProps,
} from "./NavbarMinimalContent";
import { useAppShellUserExperience } from "../../AppShellUserExperienceProvider";
import clsx from "clsx";
import { merge } from "lodash";
import PageContainer, {
  PageContainerProps,
} from "@/core/components/Page/PageContainer";
import { FrameLayoutElementProps } from "@/core/components/FrameLayout/Element";
import Pinnable, { PinnableProps } from "@/core/components/Pinnable";
import { FrameLayoutSection, NavbarOrientation } from "@/core/lib/types";
import FrameLayout from "@/core/components/FrameLayout";

export interface NavbarMinimalProps {
  pinnable?: boolean;
  componentsProps?: {
    container?: Partial<PageContainerProps>;
    content?: Partial<NavbarMinimalContentProps>;
    layoutElement?: Partial<FrameLayoutElementProps>;
    Pinnable?: Partial<PinnableProps>;
  };
}

export default function NavbarMinimal({
  pinnable = true,
  componentsProps,
}: NavbarMinimalProps): ReactNode {
  // Contexts
  const {
    userExperience: {
      navbar: { position },
    },
  } = useAppShellUserExperience();

  // State
  const [hover, setHover] = useState<boolean>(false);

  // Helpers
  const handleEnter = () => {
    setHover(true);
  };
  const handleLeave = () => {
    setHover(false);
  };

  if (
    position === FrameLayoutSection.Left ||
    position === FrameLayoutSection.Right
  ) {
    return (
      <FrameLayout.Element
        section={position}
        includeContainer={true}
        {...componentsProps?.layoutElement}
        componentsProps={merge(
          {
            container: {
              style: {
                order: -100,
              },
            },
          },
          componentsProps?.layoutElement?.componentsProps
        )}
      >
        <NavbarMinimalContent
          orientation={NavbarOrientation.Vertical}
          {...componentsProps?.content}
        />
      </FrameLayout.Element>
    );
  }
  if (
    position === FrameLayoutSection.Top ||
    position === FrameLayoutSection.Bottom
  ) {
    const content = (
      <NavbarMinimalContent
        orientation={NavbarOrientation.Horizontal}
        {...componentsProps?.content}
      />
    );
    if (pinnable) {
      return (
        <PageContainer
          {...componentsProps?.container}
          componentsProps={{
            ...componentsProps?.container?.componentsProps,
            container: {
              ...componentsProps?.container?.componentsProps?.container,
              className: clsx(
                "hide-if-empty",
                componentsProps?.container?.componentsProps?.container
                  ?.className
              ),
            },
          }}
        >
          <Pinnable
            section={position}
            initialValue={true}
            {...componentsProps?.Pinnable}
            componentsProps={merge(
              {
                container: {
                  onMouseEnter: (e) => {
                    handleEnter();
                    componentsProps?.Pinnable?.componentsProps?.container?.onMouseEnter?.(
                      e
                    );
                  },
                  onMouseLeave: (e) => {
                    handleLeave();
                    componentsProps?.Pinnable?.componentsProps?.container?.onMouseLeave?.(
                      e
                    );
                  },
                },
                button: {
                  onClick: (e) => {
                    handleLeave();
                    componentsProps?.Pinnable?.componentsProps?.button?.onClick?.(
                      e
                    );
                  },
                },
                layoutElement: {
                  includeContainer: false,
                  includePageContainer: true,
                  componentsProps: {
                    PageContainer: {
                      componentsProps: {
                        container: { style: { order: -100 } },
                      },
                    },
                  },
                },
                controls: {
                  mounted: hover,
                },
              } as PinnableProps["componentsProps"],
              componentsProps?.Pinnable?.componentsProps
            )}
          >
            {content}
          </Pinnable>
        </PageContainer>
      );
    }
    return content;
  }
  if (position === FrameLayoutSection.Content) {
    return (
      <PageContainer {...componentsProps?.container}>
        <NavbarMinimalContent
          orientation={NavbarOrientation.Horizontal}
          {...componentsProps?.content}
        />
      </PageContainer>
    );
  }
  return null;
}
