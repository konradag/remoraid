import {
  CoreUserExperience,
  NavbarSettings,
  NavbarVariant,
  UserExperienceContext,
  UserExperienceProviderProps,
} from "@/core/lib/types";
import React, { PropsWithChildren, ReactNode, useContext } from "react";
import { defaultSettings as navbarMinimalDefaultSettings } from "@/core/components/AppShell/NavbarMinimal";
import UserExperienceProvider, {
  createUserExperienceContext,
} from "../../UserExperienceProviderWrapper";

export const defaultNavbarSettings: { [V in NavbarVariant]: NavbarSettings } = {
  minimal: navbarMinimalDefaultSettings,
};
export const defaultUserExperience: CoreUserExperience = {
  navbarVariant: "minimal",
  navbarSettings: defaultNavbarSettings.minimal,
  showWelcomeMessage: true,
};
export const defaultUserExperienceCookieName = "remoraid-core-user-experience";
const coreUserExperienceContext = createUserExperienceContext(
  defaultUserExperience
);
export const useRemoraidUserExperience =
  (): UserExperienceContext<CoreUserExperience> => {
    return useContext(coreUserExperienceContext);
  };

export default function CoreUserExperienceProvider({
  children,
  initialValue,
  cookieName,
}: PropsWithChildren<
  UserExperienceProviderProps<CoreUserExperience>
>): ReactNode {
  // Helpers
  const isValidUserExperience = (x: any): x is CoreUserExperience => {
    if (typeof x !== "object") {
      return false;
    }
    if (!("showWelcomeMessage" in x)) {
      return false;
    }
    if (!("navbarVariant" in x)) {
      return false;
    }
    if (!("navbarSettings" in x)) {
      return false;
    }
    if (typeof x.navbarSettings !== "object") {
      return false;
    }
    if (!("hiddenPages" in x.navbarSettings)) {
      return false;
    }
    if (!("linkSize" in x.navbarSettings)) {
      return false;
    }
    if (!("px" in x.navbarSettings)) {
      return false;
    }
    if (!("py" in x.navbarSettings)) {
      return false;
    }
    return true;
  };

  return (
    <UserExperienceProvider<CoreUserExperience>
      context={coreUserExperienceContext}
      isValidUserExperience={isValidUserExperience}
      cookieName={cookieName ?? defaultUserExperienceCookieName}
      defaultUserExperience={defaultUserExperience}
      initialValue={initialValue}
    >
      {children}
    </UserExperienceProvider>
  );
}
