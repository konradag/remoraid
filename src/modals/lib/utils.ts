import { ContextModalProps } from "@mantine/modals";
import JSONModal from "../components/JSONModal";
import { FC } from "react";
import { RemoraidModalProps } from "./types";

export const remoraidModals: Record<
  string,
  FC<ContextModalProps<RemoraidModalProps>>
> = {
  json: JSONModal,
};
