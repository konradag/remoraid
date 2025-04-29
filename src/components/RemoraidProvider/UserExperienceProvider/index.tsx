import { NavbarSettings, NavbarVariant, UserExperience } from "@/lib/types";
import React, { PropsWithChildren, useContext } from "react";
import { useCookies } from "react-cookie";
import { defaultSettings as navbarMinimalDefaultSettings } from "@/components/AppShell/NavbarMinimal";

export const defaultNavbarSettings: { [V in NavbarVariant]: NavbarSettings } = {
  minimal: navbarMinimalDefaultSettings,
};

export const defaultUserExperience: UserExperience = {
  navbarVariant: "minimal",
  navbarSettings: defaultNavbarSettings.minimal,
  showWelcomeMessage: true,
};

const userExperienceContext = React.createContext<UserExperience>(
  defaultUserExperience
);
const updateUserExperienceContext = React.createContext<
  | ((p: UserExperience | ((prev: UserExperience) => UserExperience)) => void)
  | null
>(null);

export const useUserExperience = () => {
  return useContext(userExperienceContext);
};
export const useUpdateUserExperience = () => {
  return useContext(updateUserExperienceContext);
};

export interface UserExperienceProviderProps {
  initialValue?: UserExperience;
}

export default function UserExperienceProvider({
  children,
  initialValue,
}: PropsWithChildren<UserExperienceProviderProps>) {
  const [cookies, setCookie] = useCookies();

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
  const userExperience: UserExperience =
    cookies["userExperience"] && isUserExperience(cookies["userExperience"])
      ? cookies["userExperience"]
      : initialValue || defaultUserExperience;
  const updateUserExperience = (
    p: UserExperience | ((prev: UserExperience) => UserExperience)
  ) => {
    if (typeof p === "function") {
      setCookie("userExperience", p(userExperience), { path: "/" });
      return;
    }
    setCookie("userExperience", p, { path: "/" });
  };

  return (
    <updateUserExperienceContext.Provider value={updateUserExperience}>
      <userExperienceContext.Provider value={userExperience}>
        {children}
      </userExperienceContext.Provider>
    </updateUserExperienceContext.Provider>
  );
}
