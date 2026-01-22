import { RouterAdapter } from "remoraid/core";
import { usePathname, useRouter } from "next/navigation";

export const useNextRouterAdapter = (): RouterAdapter => {
  const router = useRouter();
  const pathname = usePathname();

  return {
    pathname,
    push: (href: string) => router.push(href),
    replace: (href: string) => router.replace(href),
  };
};
