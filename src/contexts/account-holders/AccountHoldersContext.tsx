import { createContext } from "react";

interface IAccountHoldersContext {
  clearAccountHolderContactList: Function;
  getAccountHolders: Function;
  accountHoldersList: any;
  addAccountHolder: Function;
  setIsAccountHolder: Function;
  setPrimaryPerson: Function;
  primaryPersonState: any
  setIsSecondary: Function;
  setSecondaryPersonId: Function;
  accountHolderContactList: any;
  addAccountHolderList: any;
  isAccountHolder: boolean;
  isSecondary: boolean;
  secondaryPersonId: any;
  getSecondaryPersonsInformation: Function;
}

const AccountHoldersContext = createContext<IAccountHoldersContext>({
  clearAccountHolderContactList: () => {},
  getAccountHolders: () => {},
  accountHoldersList: [],
  addAccountHolder: () => {},
  setIsAccountHolder: () => {},
  setPrimaryPerson: () => {},
  primaryPersonState: {},
  setIsSecondary: () => {},
  setSecondaryPersonId: () => {},
  accountHolderContactList: [],
  addAccountHolderList: [],
  isAccountHolder: false,
  isSecondary: false,
  secondaryPersonId: 0,
  getSecondaryPersonsInformation: () => {},
});

export default AccountHoldersContext;
