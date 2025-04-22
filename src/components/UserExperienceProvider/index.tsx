import {
  defaultNavbarSettings,
  defaultNavbarVariant,
} from "@/lib/navbar-utils";
import { UserExperience } from "@/lib/types";
import React, { PropsWithChildren, useContext } from "react";
import { useCookies } from "react-cookie";

export const defaultUserExperience: UserExperience = {
  navbarVariant: defaultNavbarVariant,
  navbarSettings: defaultNavbarSettings[defaultNavbarVariant],
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

export default function UserExperienceProvider({
  children,
}: PropsWithChildren) {
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
      : defaultUserExperience;
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
