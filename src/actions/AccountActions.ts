import authService from "../services/authService";

export const LOGIN_REQUEST = "@account/login-request";
export const LOGIN_SUCCESS = "@account/login-success";
export const LOGIN_FAILURE = "@account/login-failure";
export const GET_ROLES_LEVEL_LOGIN = "@account/silent-login";
export const LOGOUT = "@account/logout";
export const LOGOUT_FAILURE = "@account/logout-failure";
export const REGISTER = "@account/register";
// export const UPDATE_PROFILE = '@account/update-profile';

export function login(dto: Record<string, unknown>) {
  return async (dispatch: any): Promise<unknown> => {
    try {
      dispatch({ type: LOGIN_REQUEST });

      const user = await authService.loginWithDTO(dto);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user,
        },
      });

      return user;
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE });
      throw error;
    }
  };
}

export function setUserData(user: Record<string, unknown>) {
  return (dispatch: any) =>
    dispatch({
      type: GET_ROLES_LEVEL_LOGIN,
      payload: {
        user,
      },
    });
}

export function logout() {
  return async (dispatch: any): Promise<void> => {
    try {
      authService.logout();

      dispatch({
        type: LOGOUT,
      });
    } catch (error) {
      dispatch({ type: LOGOUT_FAILURE });
      throw error;
    }
  };
}

export function register() {
  return true;
}

// export function updateProfile(update) {
//   const request = axios.post('/api/account/profile', { update });
//
//   return (dispatch) => {
//     request.then((response) => dispatch({
//       type: UPDATE_PROFILE,
//       payload: response.data
//     }));
//   };
// }
