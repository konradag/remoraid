import { useRemoraidTheme } from "@/core/components/RemoraidProvider/ThemeProvider";
import { NavigationElement, NavigationElementType } from "@/core/lib/types";
import {
  Box,
  Menu,
  MenuProps,
  Transition,
  TransitionProps,
  useMantineTheme,
} from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { isValidElement, ReactElement, ReactNode } from "react";

export interface NavigationMenuProps {
  target: ReactElement | NavigationElement;
  elements?: NavigationElement[];
  label?: string;
  componentsProps?: {
    transition?: Partial<TransitionProps>;
    Menu?: Partial<MenuProps>;
  };
}

export default function NavigationMenu({
  target,
  elements,
  label,
  componentsProps,
}: NavigationMenuProps): ReactNode {
  // Contexts
  const theme = useRemoraidTheme();
  const mantineTheme = useMantineTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Helpers
  const item = (element: NavigationElement): ReactElement => (
    <Transition
      mounted={element.mounted ?? true}
      {...componentsProps?.transition}
    >
      {(transitionStyle) => (
        <Menu.Item
          leftSection={
            element.icon ? (
              <element.icon {...theme.componentsProps.icons.small} />
            ) : undefined
          }
          c={
            element.type === NavigationElementType.Anchor &&
            element.href === pathname
              ? mantineTheme.primaryColor
              : undefined
          }
          onClick={(e) => {
            if (element.type === NavigationElementType.Anchor) {
              router.push(element.href);
            }
            if (element.type === NavigationElementType.Button) {
              element.onClick(e);
            }
          }}
          style={transitionStyle}
        >
          {element.label}
        </Menu.Item>
      )}
    </Transition>
  );
  const targetElement = isValidElement(target) ? target : item(target);

  if (elements === undefined || elements.length === 0) {
    return targetElement;
  }
  return (
    <Menu trigger="click-hover" {...componentsProps?.Menu}>
      <Menu.Target>
        <Box>{targetElement}</Box>
      </Menu.Target>
      <Menu.Dropdown>
        {label !== undefined && <Menu.Label>{label}</Menu.Label>}
        {elements.map((element, i) => (
          <NavigationMenu
            key={`navigation-menu-${i}`}
            target={item(element)}
            elements={element.children}
            componentsProps={componentsProps}
          />
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
