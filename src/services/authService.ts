import jwtDecode from "jwt-decode";
import { AxiosResponse } from "axios";
import axios from "../utils/axios";
import api from "../api/api";

const quarterdeckSessionKey =
  process.env.QUARTERDECK_SESSION_KEY || "quarterdeckToken";

class AuthService {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  setAxiosInterceptors = ({ onLogout }) => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          this.setSession("");

          if (onLogout) {
            onLogout();
          }
        }

        return Promise.reject(error);
      }
    );
  };

  handleAuthentication() {
    const tokenId = this.getTokenId();

    if (!tokenId) {
      return;
    }

    if (this.isValidToken(tokenId)) {
      this.setSession(tokenId);
    } else {
      this.setSession("");
    }
  }

  isLoggedIn = () => {
    const tokenId = this.getTokenId();
    return tokenId != null && this.isValidToken(tokenId);
  };

  loginWithDTO = (dto: Record<string, unknown>) =>
    new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.PartnerAuthAPI.login(dto)
        .then((response: AxiosResponse) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.setSession(response.tokenId);

          resolve(response);
          return response;
        })
        .catch((error: Record<string, unknown>) => {
          // Token has expired, log them out
          if (error.responseCode === "200065") {
            // Resolve the promise, returning the first time login password reset
            resolve(error);
          } else {
            reject(error);
          }
        });
    });

  populateUserStore = () =>
    new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.CurrentUserAPI.getCurrentUserInfo()
        .then((response: AxiosResponse) => {
          resolve(response);
        })
        .catch((error: Record<string, unknown>) => {
          // Token has expired, log them out
          if (error.responseCode === "205062") {
            this.logout();
            // Resolve the promise
            resolve(error);
          } else {
            // TODO this should be handled via a modal
            // In order to prevent errors from being propagated
            // on normal states this only rejects on non authentication errors.
            reject(error);
          }
        });
    });

  logout = () => {
    // logout user & invalid bearer token in backend
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CurrentUserAPI.logout()
        .then(() => {
          // remove token in session storage
          this.setSession("");
        })
        .catch(() => {
          this.setSession("");
        });
  };

  setSession = (tokenId: string) => {
    if (tokenId.length > 0) {
      sessionStorage.setItem(quarterdeckSessionKey, tokenId);
      axios.defaults.headers.common.Authorization = `Bearer ${tokenId}`;
    } else {
      sessionStorage.removeItem(quarterdeckSessionKey);
      delete axios.defaults.headers.common.Authorization;
      /* Clears the cached user data. */
      // @ts-ignore
      api.CurrentUserAPI.clearCache();
    }
  };

  getTokenId = () => sessionStorage.getItem(quarterdeckSessionKey); // might need to change to session storage?

  isValidToken = (tokenId: string) => {
    if (!tokenId) {
      return false;
    }

    const decoded = jwtDecode(tokenId);
    const currentTime = Date.now() / 1000;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return decoded.exp > currentTime;
  };

  calculateRoutesBasedOnRoles(roles: any[], allowance: Record<string, any>) {
    let allowedRoutes: any[] = [];

    // for each role, run against all roles in allowance
    roles.forEach((item) => {
      // for each role in allowance being run against, populate new array with allowed routes
      if (item in allowance.roles) {
        allowedRoutes.push(allowance.roles[item].routeList);
      }
    });

    // filter out duplicates from array and flatten
    allowedRoutes = allowedRoutes.flat();
    allowedRoutes = [...new Set(allowedRoutes)];

    // return the array of allowed routes
    return allowedRoutes;
  }

  getDefaultRoute(roles: string[], allowance: Record<string, any>) {
    return this.calculateRoutesBasedOnRoles(roles, allowance)[0];
  }
}

const authService = new AuthService();

export default authService;
