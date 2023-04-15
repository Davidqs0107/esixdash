import {DrawBalanceType, DrawType, ProgramConfig, ProgramCreditCardConfig} from '../program';

interface OfferingCustomerSummary {
  programName: string,
  offeringPluginClass: string,
  customerNumber: string,
  currentBillingEndDate: string,
  currentRepaymentEndDate: string,
  overallCreditLimit: string | number,
  availableCredit: number,
  balanceRetrievalTime: string,
  interestConfigMode: InterestConfigMode,
  interestTierName: string,
  creditCardConfig: ProgramCreditCardConfig,
  drawBalances: Partial<Record<DrawType, Partial<Record<DrawBalanceType, Record<BalanceType, number>>>>>
  annualInterestRate: Record<DrawType, number>,
  repaymentPeriods: RepaymentPeriodItem[],
  interestForgivenessEligible: boolean,
  statementBalance: number,
  totalBalance: number,
  pendingBalance: number,
  availableBalance: number,
  autoLoadRuleDTO?: AutoloadRule;
  autoLoadRequestDTO?: AutoloadRequest;
  autoLoadEndDate?: number;
}

interface OfferingCustomerSummaryExtend extends OfferingCustomerSummary {
  statementBalance: number;
  totalBalance: number;
  totalPastDue: number;
  unpaidMinimums: number;
}

interface OfferingCustomerInstallmentsSummary extends OfferingCustomerSummary {
  loans?: InstallmentLoanItem[]
}

interface OfferingCustomerChildInstallmentsSummary extends OfferingCustomerSummary {
  customerNumber: string,
  periodCount: number,
  periodLength: string,
  originalAmount: number,
  creationTime: number,
  balanceTime: number,
  balances: {
    PRINCIPAL: number,
    INTEREST: number,
    FEE: number
  },
  amortizationSchedule?: AmortizationScheduleItem[]
}

interface RepaymentPeriodItem {
  from: string;
  to: string;
  minimumPaymentAmount: number;
  periodBalanceAmount: number;
}

enum InterestConfigMode {
  TIER = "TIER",
  DIRECT = "DIRECT",
}

type BalanceType = 'principalBalance' | 'interestBalance' | 'billedInterestBalance'

interface BillingHistory {
  billingPeriodStart: number;
  billingPeriodClose: number;
  nextBillingPeriodClose: number;
  repaymentPeriodEnd: number;
  nextRepaymentPeriodEnd: number;
  creditLimit: number;
  previousClosingBalance: number;
  closingBalance: number;
  minimumDue: number;
  pastDue: number;
  totalDue: number;
  fullAmountDue: number;
  purchaseBalance: number;
  cashAdvanceBalance: number;
  projectedAutoPayAmount: number;
  payments: number;
  credits: number;
  totalInterest: number;
  financialCharge: number;
  lateCharge: number;
  feeAdjustment: number;
  daysInBillingPeriod: number;
  delinquencyFlag: boolean;
  totalCostOfCredit: number;
  estimatedInterest: number;
}

interface AutoloadRule {
  id?: string;
  externalReferenceId: string;
  frequency: string;
  dayOffset: number;
  productType: string;
  autoLoadStrategy: string;
  fixedAmount?: string;
  currency: string;
  enabled: boolean;
}

interface AutoloadRequest {
  externalReferenceId: string;
  amount: number;
  currency: string;
  status: string;
  attempts: string;
  error?: string;
  submitTime: number;
  triggerTime: number;
}

interface CustomerExternalReference {
  id: string
  partnerName: string;
  referenceNumber: string;
}

interface CustomerExternalReference {
  id: string;
  referenceNumber: string;
}

enum AutoloadProductType {
  CREDIT = "CREDIT",
  SAVINGS = "SAVINGS",
  INSTALLMENTS = "INSTALLMENTS",
  DEPOSIT = "DEPOSIT"
}

interface InstallmentLoanItem {
  customerNumber: string,
  originalAmount: number,
  periodCount: number,
  periodLength: string
}

interface AmortizationScheduleItem {
  endTime: number,
  startTime: number,
  index: number,
  principalDueAmount: number,
  principalRepaidAmount: number
}

export {
  OfferingCustomerSummary,
  OfferingCustomerSummaryExtend,
  BillingHistory,
  InstallmentLoanItem,
  OfferingCustomerInstallmentsSummary,
  OfferingCustomerChildInstallmentsSummary,
  AutoloadRule,
  CustomerExternalReference,
  AutoloadProductType,
  AutoloadRequest,
};
