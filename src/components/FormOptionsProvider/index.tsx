import { FormOptions } from "@/lib/types";
import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

export const defaultFormOptions: FormOptions = {
  withDescriptions: false,
};

const formOptionsContext = React.createContext<{
  formOptions: FormOptions;
  setFormOptions: Dispatch<SetStateAction<FormOptions>> | null;
}>({
  formOptions: defaultFormOptions,
  setFormOptions: null,
});
export const useFormOptions = () => useContext(formOptionsContext);

interface FormOptionsProviderProps {
  initialValue?: Partial<FormOptions>;
}

export default function FormOptionsProvider({
  children,
  initialValue,
}: PropsWithChildren<FormOptionsProviderProps>) {
  // State
  const [formOptions, setFormOptions] = useState({
    ...defaultFormOptions,
    ...initialValue,
  });

  return (
    <formOptionsContext.Provider value={{ formOptions, setFormOptions }}>
      {children}
    </formOptionsContext.Provider>
  );
}
