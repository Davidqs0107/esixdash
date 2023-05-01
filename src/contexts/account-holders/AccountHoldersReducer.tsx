import {
  ADD_ACCOUNT_HOLDERS,
  GET_ACCOUNT_HOLDERS,
  GET_TOTAL_ACCOUNT_HOLDERS,
  SET_ACCOUNT_HOLDER_CONTACT_LIST,
  CLEAR_CONTACT_LIST,
  SET_IS_ACCOUNT_HOLDER,
  SET_IS_SECONDARY,
  SET_PRIMARY_PERSON,
  SET_SECONDARY_PERSON_ID,
} from "./Types";

export default (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  state: any,
  action: {
    type: any;
    payload: { data: any };
  }
) => {
  const { data } = action.payload;

  switch (action.type) {
    case GET_ACCOUNT_HOLDERS:
      return {
        ...state,
        accountHoldersList: [...data],
      };
    case GET_TOTAL_ACCOUNT_HOLDERS:
      return {
        ...state,
        totalAccountHolders: data,
      };
    case SET_ACCOUNT_HOLDER_CONTACT_LIST:
      return {
        ...state,
        accountHolderContactList: [...state.accountHolderContactList, ...data],
      };
    case CLEAR_CONTACT_LIST:
      return {
        ...state,
        accountHolderContactList: [],
        totalAccountholders: 0,
      };
    case ADD_ACCOUNT_HOLDERS:
      return {
        ...state,
        addAccountHolderList: data,
      };
    case SET_PRIMARY_PERSON:
      return {
        ...state,
        primaryPersonState: data,
      };
    case SET_IS_SECONDARY:
      return {
        ...state,
        isSecondary: data,
      };

    case SET_SECONDARY_PERSON_ID:
      return {
        ...state,
        secondaryPersonId: data,
      };
    case SET_IS_ACCOUNT_HOLDER:
      return {
        ...state,
        isAccountHolder: data,
      };
    default:
      return state;
  }
};
