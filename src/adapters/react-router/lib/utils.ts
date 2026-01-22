import { useLocation, useNavigate } from "react-router-dom";
import type { RouterAdapter } from "remoraid/core";

export const useReactRouterAdapter = (): RouterAdapter => {
  const location = useLocation();
  const navigate = useNavigate();

  return {
    pathname: location.pathname,
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
  };
};
