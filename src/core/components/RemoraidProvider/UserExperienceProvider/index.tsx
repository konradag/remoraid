import {
  NavbarSettings,
  NavbarVariant,
  UserExperience,
} from "@/core/lib/types";
import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { defaultSettings as navbarMinimalDefaultSettings } from "@/core/components/AppShell/NavbarMinimal";

export const defaultNavbarSettings: { [V in NavbarVariant]: NavbarSettings } = {
  minimal: navbarMinimalDefaultSettings,
};

export const defaultUserExperience: UserExperience = {
  navbarVariant: "minimal",
  navbarSettings: defaultNavbarSettings.minimal,
  showWelcomeMessage: true,
};

export interface UserExperienceContext {
  userExperience: UserExperience;
  updateUserExperience: (
    p: UserExperience | ((prev: UserExperience) => UserExperience)
  ) => void;
  processedCookie: boolean;
}

const userExperienceContext = React.createContext<UserExperienceContext>({
  userExperience: defaultUserExperience,
  updateUserExperience: () => {},
  processedCookie: false,
});

export const userExperienceCookieName = "remoraid-user-experience";

export const useRemoraidUserExperience = (): UserExperienceContext => {
  return useContext(userExperienceContext);
};

export interface UserExperienceProviderProps {
  initialValue?: Partial<UserExperience>;
}

export default function UserExperienceProvider({
  children,
  initialValue,
}: PropsWithChildren<UserExperienceProviderProps>): ReactNode {
  const [cookies, setCookie] = useCookies();

  // State
  const [userExperience, setUserExperience] = useState<UserExperience>({
    ...defaultUserExperience,
    ...initialValue,
  });
  const [processedCookie, setProcessedCookie] = useState<boolean>(false);

  // Helpers
  const isUserExperience = (x: any): x is UserExperience => {
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

  const updateUserExperience = (
    p: UserExperience | ((prev: UserExperience) => UserExperience)
  ) => {
    const updatedUserExperience =
      typeof p === "function" ? p(userExperience) : p;
    setCookie(userExperienceCookieName, updatedUserExperience, { path: "/" });
    setUserExperience(updatedUserExperience);
  };

  // Effects
  useEffect(() => {
    const userExperienceCookie = cookies[userExperienceCookieName];
    if (userExperienceCookie && isUserExperience(userExperienceCookie)) {
      setUserExperience(userExperienceCookie);
    }
    if (cookies && !processedCookie) {
      setProcessedCookie(true);
    }
  }, [cookies]);

  return (
    <userExperienceContext.Provider
      value={{ userExperience, updateUserExperience, processedCookie }}
    >
      {children}
    </userExperienceContext.Provider>
  );
}
