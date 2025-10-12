import { ComponentProps, ReactNode } from "react";
import { useRemoraidApp } from "../AppProvider";
import FooterMinimal, { FooterMinimalProps } from "./FooterMinimal";
import {
  AppShellFooterVariant,
  FooterPosition,
  FooterVariant,
  FrameLayoutSection,
} from "@/core/lib/types";

export const supportedFooterPositions: Record<
  Exclude<AppShellFooterVariant, null>,
  FooterPosition[]
> = {
  [FooterVariant.Minimal]: [
    null,
    FrameLayoutSection.Bottom,
    FrameLayoutSection.Content,
  ],
};

export const defaultFooterPositions: Record<
  Exclude<AppShellFooterVariant, null>,
  FooterPosition
> = {
  [FooterVariant.Minimal]: FrameLayoutSection.Content,
};

export interface FooterProps {
  componentsProps?: {
    FooterMinimal?: Partial<FooterMinimalProps>;
  };
}

function Footer({ componentsProps }: FooterProps): ReactNode {
  // Contexts
  const { footerVariant } = useRemoraidApp();

  if (footerVariant === FooterVariant.Minimal) {
    return <FooterMinimal {...componentsProps?.FooterMinimal} />;
  }
  return null;
}

export interface Footer extends React.FC<ComponentProps<typeof Footer>> {
  FooterMinimal: typeof FooterMinimal;
}
export default Object.assign(Footer, {
  FooterMinimal: FooterMinimal,
}) as Footer;
