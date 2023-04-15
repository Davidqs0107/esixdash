import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData, logout, LOGIN_FAILURE } from "../actions/AccountActions";
import authService from "../services/authService";
import SplashScreen from "./SplashScreen";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function Auth({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);

  //
  // This should be able to replace the API auth check
  //

  useEffect(() => {
    const initAuth = async () => {
      authService.setAxiosInterceptors({
        onLogout: () => dispatch(logout()),
      });

      authService.handleAuthentication();

      try {
        if (authService.isLoggedIn()) {
          const user = await authService.populateUserStore();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await dispatch(setUserData(user));
        }
      } catch (error) {
        // TODO: When the session times out, but before we've had a chance to cull it naturally we can error inside
        // populateUserStore, this is a stop gap to solve that issue.
        authService.logout();
      }

      setLoading(false);
    };

    initAuth();
  }, [dispatch]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return children;
}

export default Auth;
