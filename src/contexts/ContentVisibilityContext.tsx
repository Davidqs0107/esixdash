import React, { useContext } from "react";
import { PartnerUserContext } from "./PartnerUserContext";

interface IContentVisibilityContext {
  canSeeExchanges: boolean;
  canSeeInterchanges: boolean;
  canSeeLinkedPartners: boolean;
  canSeeLinkedPrograms: boolean;
  canSeeCustomerOfficialIds: boolean;
  canSeeCustomerMemos: boolean;
  canSeeCustomerCardBlocks: boolean;
  canSeePartnerProfile: boolean;
  canSeeBanks: boolean;
  canSeeRiskLevels: boolean;
  canSeePAN: boolean;
  canSeeCardOrderDetails: boolean;
  canAddNewPartner: boolean;
  readOnly: boolean;
  canLockUser: boolean;
  canDeleteChangeOrder: boolean;
  canManagePerson: boolean;
  canManagePhoneNumber: boolean;
  canManageEmailAddress: boolean;
  canManageGeographicalAddress: boolean;
  canManageOfficialID: boolean;
  canManageMerchantControl: boolean;
  canManageControlLevel: boolean;
  canSeeCustomerChangeOrders: boolean;
  canSeeProgramChangeOrders: boolean;
  canSeePartnerChangeOrders: boolean;
  canApproveChangeOrder: boolean;
}

export const ContentVisibilityContext =
  React.createContext<IContentVisibilityContext>({
    canSeeExchanges: false,
    canSeeInterchanges: false,
    canSeeLinkedPartners: false,
    canSeeLinkedPrograms: false,
    canSeeCustomerOfficialIds: false,
    canSeeCustomerMemos: false,
    canSeeCustomerCardBlocks: false,
    canSeePartnerProfile: false,
    canSeeBanks: false,
    canSeeRiskLevels: false,
    canSeePAN: false,
    canSeeCardOrderDetails: false,
    canAddNewPartner: false,
    readOnly: false,
    canLockUser: false,
    canDeleteChangeOrder: false,
    canManagePerson: false,
    canManagePhoneNumber: false,
    canManageEmailAddress: false,
    canManageGeographicalAddress: false,
    canManageOfficialID: false,
    canManageMerchantControl: false,
    canManageControlLevel: false,
    canSeeCustomerChangeOrders: false,
    canSeeProgramChangeOrders: false,
    canSeePartnerChangeOrders: false,
    canApproveChangeOrder: false,
  });

const ContentVisibilityContextProvider: React.FC<any> = ({ children }) => {
  const { roles } = useContext(PartnerUserContext);
  const PLATFORM_MANAGER = "PlatformManager";
  const PROGRAM_MANAGER = "ProgramManager";
  const FINANCIAL_MANAGER = "FinancialManager";
  const RISK_MANAGER = "RiskManager";
  const RISK_AGENT = "RiskAgent";
  const CUSTOMER_MANAGER = "CustomerManager";
  const CUSTOMER_AGENT = "CustomerAgent";
  const READ_ONLY = "ReadOnly";
  const RETAIL_MANAGER = "RetailManager";
  const STORE_MANAGER = "StoreManager";
  const APPROVER = "Approver";

  const containsRoles = (
    requiredRoles: string[],
    userProvidedRoles: string[]
  ) => {
    if (userProvidedRoles !== undefined) {
      for (let i = 0; i < requiredRoles.length; i++) {
        if (userProvidedRoles.indexOf(requiredRoles[i]) > -1) {
          return true;
        }
      }
    }
    return false;
  };

  const canSeeExchanges = () => {
    return containsRoles([PROGRAM_MANAGER, FINANCIAL_MANAGER], roles);
  };

  const canSeeInterchanges = () => {
    return containsRoles([PLATFORM_MANAGER], roles);
  };

  const canSeeLinkedPartners = () => {
    return containsRoles([PLATFORM_MANAGER, PROGRAM_MANAGER], roles);
  };

  const canSeeLinkedPrograms = () => {
    return containsRoles([PLATFORM_MANAGER, PROGRAM_MANAGER], roles);
  };

  const canSeeCustomerOfficialIds = () => {
    return containsRoles([RISK_MANAGER, RISK_AGENT], roles);
  };

  const canSeePartnerProfile = () => {
    return containsRoles([PLATFORM_MANAGER], roles);
  };

  const canAddNewPartner = () => {
    return containsRoles([PLATFORM_MANAGER, PROGRAM_MANAGER], roles);
  };

  const canSeeBanks = () => {
    return containsRoles([PLATFORM_MANAGER, PROGRAM_MANAGER], roles);
  };

  const canSeeRiskLevels = () => {
    return containsRoles(
      [PLATFORM_MANAGER, PROGRAM_MANAGER, RISK_MANAGER, RISK_AGENT],
      roles
    );
  };

  const canSeePAN = () => {
    return containsRoles([RISK_MANAGER, RISK_AGENT], roles);
  };

  const canSeeCardOrderDetails = () => {
    return containsRoles([CUSTOMER_AGENT, CUSTOMER_MANAGER], roles);
  };

  const canSeeCustomerMemos = () => {
    return containsRoles([CUSTOMER_AGENT, CUSTOMER_MANAGER, READ_ONLY], roles);
  };

  const canSeeCustomerCardBlocks = () => {
    return containsRoles([CUSTOMER_AGENT, CUSTOMER_MANAGER, READ_ONLY], roles);
  };

  const canManagePerson = () => {
    return containsRoles(
      [CUSTOMER_AGENT, CUSTOMER_MANAGER, RISK_AGENT, RISK_MANAGER],
      roles
    );
  };

  const canManagePhoneNumber = () => {
    return containsRoles(
      [CUSTOMER_AGENT, CUSTOMER_MANAGER, RISK_AGENT, RISK_MANAGER],
      roles
    );
  };

  const canManageEmailAddress = () => {
    return containsRoles(
      [CUSTOMER_AGENT, CUSTOMER_MANAGER, RISK_AGENT, RISK_MANAGER],
      roles
    );
  };

  const canManageGeographicalAddress = () => {
    return containsRoles(
      [CUSTOMER_AGENT, CUSTOMER_MANAGER, RISK_AGENT, RISK_MANAGER],
      roles
    );
  };

  const canManageOfficialID = () => {
    return containsRoles([RISK_AGENT, RISK_MANAGER], roles);
  };

  const canManageMerchantControl = () => {
    return containsRoles([PROGRAM_MANAGER], roles);
  };

  const canManageControlLevel = () => {
    return containsRoles(
      [RISK_AGENT, RISK_MANAGER, PROGRAM_MANAGER, FINANCIAL_MANAGER],
      roles
    );
  };

  //user should not have read-only and other rules at same time
  function isReadyOnly() {
    return roles && roles[0] === READ_ONLY;
  }

  const canLockUser = () => {
    return containsRoles(
      [
        PLATFORM_MANAGER,
        PROGRAM_MANAGER,
        CUSTOMER_MANAGER,
        RISK_MANAGER,
        RETAIL_MANAGER,
        STORE_MANAGER,
      ],
      roles
    );
  };

  const canSeeCustomerChangeOrders = () => {
    return containsRoles(
      [CUSTOMER_AGENT, CUSTOMER_MANAGER, RISK_MANAGER, RISK_AGENT, APPROVER],
      roles
    );
  };

  const canSeeProgramChangeOrders = () => {
    return containsRoles([PROGRAM_MANAGER, FINANCIAL_MANAGER, APPROVER], roles);
  };

  const canSeePartnerChangeOrders = () => {
    return containsRoles([PROGRAM_MANAGER, APPROVER], roles);
  };

  const canDeleteChangeOrder = () => {
    return containsRoles(
      [
        CUSTOMER_AGENT,
        CUSTOMER_MANAGER,
        RISK_MANAGER,
        RISK_AGENT,
        PROGRAM_MANAGER,
        FINANCIAL_MANAGER,
        APPROVER,
      ],
      roles
    );
  };

  const canApproveChangeOrder = () => {
    return containsRoles([APPROVER], roles);
  };

  return (
    <ContentVisibilityContext.Provider
      value={{
        canSeeExchanges: canSeeExchanges(),
        canSeeInterchanges: canSeeInterchanges(),
        canSeeLinkedPartners: canSeeLinkedPartners(),
        canSeeLinkedPrograms: canSeeLinkedPrograms(),
        canSeeCustomerOfficialIds: canSeeCustomerOfficialIds(),
        canSeeCustomerMemos: canSeeCustomerMemos(),
        canSeeCustomerCardBlocks: canSeeCustomerCardBlocks(),
        canSeePartnerProfile: canSeePartnerProfile(),
        canSeeBanks: canSeeBanks(),
        canSeeRiskLevels: canSeeRiskLevels(),
        canSeePAN: canSeePAN(),
        canSeeCardOrderDetails: canSeeCardOrderDetails(),
        canAddNewPartner: canAddNewPartner(),
        readOnly: isReadyOnly(),
        canLockUser: canLockUser(),
        canDeleteChangeOrder: canDeleteChangeOrder(),
        canManagePerson: canManagePerson(),
        canManagePhoneNumber: canManagePhoneNumber(),
        canManageEmailAddress: canManageEmailAddress(),
        canManageGeographicalAddress: canManageGeographicalAddress(),
        canManageOfficialID: canManageOfficialID(),
        canManageMerchantControl: canManageMerchantControl(),
        canManageControlLevel: canManageControlLevel(),
        canSeeCustomerChangeOrders: canSeeCustomerChangeOrders(),
        canSeeProgramChangeOrders: canSeeProgramChangeOrders(),
        canSeePartnerChangeOrders: canSeePartnerChangeOrders(),
        canApproveChangeOrder: canApproveChangeOrder(),
      }}
    >
      {children}
    </ContentVisibilityContext.Provider>
  );
};

export default ContentVisibilityContextProvider;
