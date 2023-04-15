interface InterestRateTierItem {
  PURCHASE?: number,
  CASH_ADVANCE?: number,
  FEE?: number,
}

interface InterestRateTierHelperItem extends InterestRateTierItem {
  persisted: boolean;
  name: string;
}

interface Program {
  programName: string,
  config: ProgramConfig | ProgramCreditCardConfig | ProgramInstallmentsConfig
  offeringClassName: string
}

interface ProgramConfig {
  minSpendLimit?: number | null,
  maxSpendLimit?: number | null,
  latePaymentFee?: number | null,
  daysPerYear?: number | null | string,
  interestTiersHelper?: InterestRateTierHelperItem[]
  interestTiers?: Record<string, InterestRateTierItem>,
}

interface ProgramCreditCardConfig extends ProgramConfig {
  drawTypes: DrawType[],
  repaymentPeriodLength: number | null,
  minimumPaymentPercentages: PaymentPercentages
  interestConfig: Record<DrawType, InterestConfiguration>,
  repaymentHierarchy: RepaymentHierarchyItem[]
  minimumPaymentStandardThreshold: number | null,
  minimumPaymentOverallBalancePercentage: number | null,
  minimumPaymentOwedPastDuePercentage: number | null,
  repaymentDueShiftSetting?: string | null,
  automaticLoadShiftSetting?: string | null,
  currentPeriodGraceReturnBilling?: string | null;
  repaymentAssessmentRequirement?: string | null;
}

interface ProgramInstallmentsConfig extends ProgramConfig {
  minCreditLimit: number | null,
  maxCreditLimit: number | null,
  periodCount: number | null,
  periodLength: string | null,
  minimumPrincipal: number | null,
  firstPaymentDaysOffset: number | null,
  currency?: string | null,
}

type DrawType = 'PURCHASE' | 'CASH_ADVANCE' | 'FEE'
type DrawBalanceType = | 'CURRENT' | 'OWED' | 'PREVIOUS'
type DrawBalanceSubType = 'PRINCIPAL' | 'INTEREST'
type InterestType = 'SIMPLE' | 'COMPOUND' | 'HYBRID' | 'NONE'

interface InterestConfiguration {
  daysPerYear: number | null,
  minAnnualRate: number | null,
  maxAnnualRate: number | null,
  defaultAnnualRate: number | null,
  interestMode: InterestType | '',
}

interface RepaymentHierarchyItem {
  drawType: DrawType,
  drawBalanceType: DrawBalanceType,
  drawBalanceSubType: DrawBalanceSubType,
  name?: string
}

type PaymentPercentages = Record<DrawType, Partial<Record<DrawBalanceType, Record<DrawBalanceSubType, number | null>>>>;

export {
  InterestRateTierItem,
  ProgramConfig,
  ProgramCreditCardConfig,
  ProgramInstallmentsConfig,
  DrawType,
  RepaymentHierarchyItem,
  PaymentPercentages,
  InterestType,
  DrawBalanceType,
  DrawBalanceSubType,
  InterestConfiguration,
  Program,
  InterestRateTierHelperItem
};
