/* eslint-disable no-param-reassign */
import produce from "immer";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  LOGOUT_FAILURE,
  GET_ROLES_LEVEL_LOGIN,
  // UPDATE_PROFILE
} from "../actions/AccountActions";

const initialState = {
  user: null,
};

const AccountReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case LOGIN_REQUEST: {
      return produce(state, (draft) => {
        // Ensure we clear current session
        draft.user = null;
      });
    }

    case LOGIN_SUCCESS: {
      const { user } = action.payload;

      return produce(state, (draft) => {
        draft.user = user;
      });
    }

    case LOGIN_FAILURE: {
      return produce(state, () => {
        // Maybe store error
      });
    }

    case LOGOUT: {
      return produce(state, (draft) => {
        draft.user = null;
      });
    }

    case LOGOUT_FAILURE: {
      return produce(state, () => {
        // Maybe store error
      });
    }

    case GET_ROLES_LEVEL_LOGIN: {
      const { user } = action.payload;

      return produce(state, (draft) => {
        draft.user = user;
      });
    }

    // case UPDATE_PROFILE: {
    //   const { user } = action.payload;
    //
    //   return produce(state, (draft) => {
    //     draft.user = user;
    //   });
    // }

    default: {
      return state;
    }
  }
};

export default AccountReducer;
