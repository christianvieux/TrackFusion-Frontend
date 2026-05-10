import React from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";

export const withAuthGuard = (WrappedComponent) => {
  return function AuthGuardedComponent(props) {
    const isAuthenticated = useAuthGuard();

    return <WrappedComponent {...props} isAuthenticated={isAuthenticated} />;
  };
};