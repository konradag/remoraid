import {
  CoreUserExperience,
  UserExperienceContext,
  UserExperienceProviderProps,
} from "@/core/lib/types";
import React, { PropsWithChildren, ReactNode, useContext } from "react";
import UserExperienceProviderWrapper, {
  createUserExperienceContext,
} from "../../UserExperienceProviderWrapper";

export const defaultUserExperience: CoreUserExperience = {
  showWelcomeMessage: true,
  navbar: { hiddenPages: [] },
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
  const isValidUserExperience = (x: unknown): x is CoreUserExperience => {
    if (typeof x !== "object") {
      return false;
    }
    if (x === null) {
      return false;
    }
    if (!("showWelcomeMessage" in x)) {
      return false;
    }
    if (!("navbar" in x)) {
      return false;
    }
    return true;
  };

  return (
    <UserExperienceProviderWrapper<CoreUserExperience>
      context={coreUserExperienceContext}
      isValidUserExperience={isValidUserExperience}
      cookieName={cookieName ?? defaultUserExperienceCookieName}
      defaultUserExperience={defaultUserExperience}
      initialValue={initialValue}
    >
      {children}
    </UserExperienceProviderWrapper>
  );
}
