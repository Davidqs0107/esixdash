const rolesRouteConfig: Record<string, any> = {
  roles: {
    Approver: {
      routeList: ["change"],
    },
    Auditor: {
      routeList: ["audit"],
    },
    CustomerAgent: {
      routeList: ["customer", "change"],
    },
    CustomerManager: {
      routeList: ["customer", "separator", "users", "change"],
    },
    FinancialManager: {
      routeList: ["banks", "programs", "partners", "change"],
    },
    PlatformManager: {
      routeList: ["banks", "partners", "separator", "users"],
    },
    ProgramManager: {
      routeList: ["banks", "programs", "separator", "users", "partners", "change"],
    },
    System: {
      routeList: [],
    },
    StoreAgent: {
      routeList: [],
    },
    StoreManager: {
      routeList: ["users"],
    },
    RetailManager: {
      routeList: ["users"],
    },
    RiskAgent: {
      routeList: ["customer", "change"],
    },
    RiskManager: {
      routeList: ["customer", "separator", "users", "change"],
    },
    ReadOnly: {
      routeList: ["customer"],
    },
  },
};

export default rolesRouteConfig;
