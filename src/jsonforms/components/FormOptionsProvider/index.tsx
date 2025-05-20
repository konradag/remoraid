import { FormOptions } from "@/jsonforms/lib/types";
import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";

export const defaultFormOptions: FormOptions = {
  withDescriptions: false,
};

export interface FormOptionsContext {
  formOptions: FormOptions;
  updateFormOptions: (newFormOptions: Partial<FormOptions>) => void;
}

const formOptionsContext = React.createContext<FormOptionsContext>({
  formOptions: defaultFormOptions,
  updateFormOptions: () => {},
});
export const useFormOptions = (): FormOptionsContext =>
  useContext(formOptionsContext);

export interface FormOptionsProviderProps {
  initialValue?: Partial<FormOptions>;
}

export default function FormOptionsProvider({
  children,
  initialValue,
}: PropsWithChildren<FormOptionsProviderProps>): ReactNode {
  // State
  const [formOptions, setFormOptions] = useState({
    ...defaultFormOptions,
    ...initialValue,
  });

  // Helpers
  const updateFormOptions = (newFormOptions: Partial<FormOptions>) => {
    setFormOptions((prev) => ({ ...prev, ...newFormOptions }));
  };

  return (
    <formOptionsContext.Provider value={{ formOptions, updateFormOptions }}>
      {children}
    </formOptionsContext.Provider>
  );
}
