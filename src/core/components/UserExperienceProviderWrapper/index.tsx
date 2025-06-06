import { UserExperience, UserExperienceContext } from "@/core/lib/types";
import React, {
  Context,
  createContext,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";

export const createUserExperienceContext = <T extends UserExperience>(
  defaultUserExperience: T
): Context<UserExperienceContext<T>> =>
  createContext<UserExperienceContext<T>>({
    userExperience: defaultUserExperience,
    updateUserExperience: () => {},
    processedCookie: false,
  });

export interface UserExperienceProviderWrapperProps<T extends UserExperience> {
  context: Context<UserExperienceContext<T>>;
  cookieName: string;
  defaultUserExperience: T;
  isValidUserExperience: (x: unknown) => x is T;
  initialValue?: Partial<T>;
}

export default function UserExperienceProviderWrapper<
  T extends UserExperience
>({
  children,
  context,
  cookieName,
  defaultUserExperience,
  isValidUserExperience,
  initialValue,
}: PropsWithChildren<UserExperienceProviderWrapperProps<T>>): ReactNode {
  const [cookies, setCookie] = useCookies();

  // State
  const [userExperience, setUserExperience] = useState<T>({
    ...defaultUserExperience,
    ...initialValue,
  });
  const [processedCookie, setProcessedCookie] = useState<boolean>(false);

  // Helpers
  const updateUserExperience = (
    p: UserExperience | ((prev: UserExperience) => UserExperience)
  ) => {
    const updatedUserExperience =
      typeof p === "function" ? p(userExperience) : p;
    setCookie(cookieName, updatedUserExperience, { path: "/" });
    setUserExperience(updatedUserExperience);
  };

  // Effects
  useEffect(() => {
    const userExperienceCookie = cookies[cookieName];
    if (userExperienceCookie && isValidUserExperience(userExperienceCookie)) {
      setUserExperience(userExperienceCookie);
    }
    if (cookies && !processedCookie) {
      setProcessedCookie(true);
    }
  }, [cookies]);

  return (
    <context.Provider
      value={{ userExperience, updateUserExperience, processedCookie }}
    >
      {children}
    </context.Provider>
  );
}
