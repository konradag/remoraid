import React, { PropsWithChildren, ReactNode, useContext } from "react";
import { merge } from "lodash";
import { useRemoraidApp } from "../AppProvider";
import { defaultFooterPositions } from "../Footer";
import { defaultNavbarPositions } from "../Navbar";
import {
  AppShellUserExperience,
  NavbarMode,
  UserExperienceContext,
  UserExperienceProviderProps,
} from "@/core/lib/types";
import UserExperienceProviderWrapper, {
  createUserExperienceContext,
} from "../../UserExperienceProviderWrapper";

export const defaultAppShellUserExperience: AppShellUserExperience = {
  navbar: {
    position: null,
    mobilePosition: null,
    mode: NavbarMode.Responsive,
  },
  footer: {
    position: null,
  },
};

export const defaultAppShellUserExperienceCookieName =
  "remoraid-app-shell-user-experience";

const appShellUserExperienceContext = createUserExperienceContext(
  defaultAppShellUserExperience
);

export const useAppShellUserExperience =
  (): UserExperienceContext<AppShellUserExperience> => {
    return useContext(appShellUserExperienceContext);
  };

export default function AppShellUserExperienceProvider({
  children,
  initialValue,
  cookieName,
}: PropsWithChildren<
  UserExperienceProviderProps<AppShellUserExperience>
>): ReactNode {
  // Contexts
  const { navbarVariant, footerVariant } = useRemoraidApp();

  // Helpers
  const isValidUserExperience = (x: unknown): x is AppShellUserExperience => {
    if (typeof x !== "object") {
      return false;
    }
    if (x === null) {
      return false;
    }
    if (!("navbar" in x)) {
      return false;
    }
    if (!("footer" in x)) {
      return false;
    }
    return true;
  };

  return (
    <UserExperienceProviderWrapper<AppShellUserExperience>
      context={appShellUserExperienceContext}
      isValidUserExperience={isValidUserExperience}
      cookieName={cookieName ?? defaultAppShellUserExperienceCookieName}
      defaultUserExperience={defaultAppShellUserExperience}
      initialValue={merge(
        {
          navbar: {
            position:
              navbarVariant === null
                ? null
                : defaultNavbarPositions[navbarVariant],
          },
          footer: {
            position:
              footerVariant === null
                ? null
                : defaultFooterPositions[footerVariant],
          },
        },
        initialValue
      )}
    >
      {children}
    </UserExperienceProviderWrapper>
  );
}
