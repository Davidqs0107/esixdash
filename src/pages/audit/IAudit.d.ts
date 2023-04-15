export interface IAudit {
  filters:
    | {
        customDateRange: boolean;
        startTime: string | number;
        endTime: string | number;
        startIndex: number;
        ascending: boolean;
        partnerUser: string;
        customerNumber: string;
        pageSize: number;
        count: number;
      }
    | undefined;
  // need to approach this better...
  // The original intention of Function is to not be callable.
  // in other words, Function to function types should be like unknown to other types,
  // but not callable.
  // eslint-disable-next-line @typescript-eslint/ban-types
  setFilters: Function | any;
  totalCount: number;
  pageSize: number;
  auditDetailInfo: {
    id: string | number;
    partnerName: string;
    userName: string;
    remoteAddress: string;
    api: string;
    creationTime: string;
    success: boolean;
    responseCode: string;
    path: string;
    arguments: string;
  };
  setAuditDetails: Function | any;
  showDetails: boolean;
  setShowDetails: Function | any;
  dataList:
    | {
        count: number;
        startIndex: number;
        endIndex: number;
        lastPage: boolean;
        totalCount: number;
        data: [
          {
            creationTime: number;
            modifiedTime: number;
            id: string;
            api: string;
            path: string;
            method: string;
            arguments: string;
            remoteAddress: string;
            partnerId: string;
            partnerUserId: string;
            success: boolean;
            userName: string;
            partnerName: string;
          }
        ];
      }
    | undefined;
  auditList: [{}];
}
