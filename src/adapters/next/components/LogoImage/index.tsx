import { MantineSize } from "@mantine/core";
import Image, { ImageProps } from "next/image";
import { ReactElement } from "react";
import {
  getDefaultButtonIconSize,
  RemoraidIconSize,
  useRemoraidTheme,
  defaultRemoraidButtonSize,
} from "remoraid/core";

export interface LogoImageProps {
  src: ImageProps["src"];
  size?: RemoraidIconSize;
  buttonSize?: MantineSize;
  componentsProps?: {
    image?: Partial<ImageProps>;
  };
}

export default function LogoImage({
  src,
  size,
  buttonSize,
  componentsProps,
}: LogoImageProps): ReactElement {
  // Contexts
  const theme = useRemoraidTheme();

  // Helpers
  const iconSize =
    size ?? getDefaultButtonIconSize(buttonSize ?? defaultRemoraidButtonSize);

  return (
    <Image
      src={src}
      alt="App logo"
      {...componentsProps?.image}
      style={{
        width: theme.componentsProps.icons[iconSize].size,
        height: theme.componentsProps.icons[iconSize].size,
        ...componentsProps?.image?.style,
      }}
    />
  );
}
