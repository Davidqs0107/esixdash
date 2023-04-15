import * as Yup from "yup";

Yup.addMethod(Yup.array, "unique", function (field, message) {
  return this.test("unique", message, function (array) {
    if (!array) {
      return true;
    }
    const uniqueData = Array.from(
      new Set(array.map((row) => row[field]?.toLowerCase()))
    );
    const isUnique = array.length === uniqueData.length;
    if (isUnique) {
      return true;
    }
    const index = array.findIndex(
      (row, i) => row[field]?.toLowerCase() !== uniqueData[i]
    );
    if (array[index] && array[index][field] === "") {
      return true;
    }
    return this.createError({
      path: `${this.path}.${index}.${field}`,
      message,
    });
  });
});

export const creditFormSchema = Yup.object().shape({
  drawTypes: Yup.array().min(1, "at least 1").required("required"),
  repaymentPeriodLength: Yup.number()
    .required()
    .min(20)
    .max(28)
    .typeError("A number is required"),
  latePaymentFee: Yup.number().min(0),
  daysPerYear: Yup.number()
    .oneOf([360, 365, 366])
    .required()
    .typeError("A number is required"),
  minSpendLimit: Yup.number()
    .required()
    .typeError("A number is required")
    .min(0)
    .lessThan(Yup.ref("maxSpendLimit"), "Must be less than maximum allowed"),
  maxSpendLimit: Yup.number()
    .required()
    .typeError("A number is required")
    .moreThan(0)
    .moreThan(Yup.ref("minSpendLimit"), "Must be more than minimum allowed"),
  minimumPaymentOverallBalancePercentage: Yup.number()
    .required()
    .typeError("A number is required")
    .min(0),
  minimumPaymentStandardThreshold: Yup.number()
    .required()
    .typeError("A number is required")
    .min(0),
  minimumPaymentOwedPastDuePercentage: Yup.number()
    .required()
    .typeError("A number is required")
    .min(0)
    .max(100),
  interestConfig: Yup.object().shape({
    PURCHASE: Yup.object()
      .shape({
        interestMode: Yup.string()
          .oneOf(["SIMPLE", "COMPOUND", "HYBRID", "NONE"])
          .required("A value is required")
          .typeError("A value is required"),
        minAnnualRate: Yup.number()
          .required()
          .typeError("A number is required")
          .min(0)
          .max(
            Yup.ref("defaultAnnualRate"),
            "Must be less than or equal to default"
          ),
        defaultAnnualRate: Yup.number()
          .required()
          .typeError("A number is required")
          .min(0),
        maxAnnualRate: Yup.number()
          .required()
          .typeError("A number is required")
          .min(
            Yup.ref("defaultAnnualRate"),
            "Must be more than or equal to default"
          ),
      })
      .default(undefined),
    CASH_ADVANCE: Yup.object()
      .shape({
        interestMode: Yup.string()
          .oneOf(["SIMPLE", "COMPOUND", "HYBRID", "NONE"])
          .required("A value is required")
          .typeError("A value is required"),
        minAnnualRate: Yup.number()
          .required()
          .typeError("A number is required")
          .min(0)
          .max(
            Yup.ref("defaultAnnualRate"),
            "Must be less than or equal to default"
          ),
        defaultAnnualRate: Yup.number()
          .required()
          .typeError("A number is required")
          .min(0),
        maxAnnualRate: Yup.number()
          .required()
          .typeError("A number is required")
          .min(
            Yup.ref("defaultAnnualRate"),
            "Must be more than or equal to default"
          ),
      })
      .default(undefined),
    FEE: Yup.object()
      .shape({
        interestMode: Yup.string()
          .oneOf(["SIMPLE", "COMPOUND", "HYBRID", "NONE"])
          .required("A value is required"),
        minAnnualRate: Yup.number()
          .required()
          .typeError("A number is required")
          .min(0)
          .max(
            Yup.ref("defaultAnnualRate"),
            "Must be less than or equal to default"
          ),
        defaultAnnualRate: Yup.number()
          .required()
          .typeError("A number is required")
          .min(0),
        maxAnnualRate: Yup.number()
          .required()
          .typeError("A number is required")
          .min(
            Yup.ref("defaultAnnualRate"),
            "Must be more than or equal to default"
          ),
      })
      .default(undefined),
  }),
  minimumPaymentPercentages: Yup.object().shape({
    PURCHASE: Yup.object().shape({
      PREVIOUS: Yup.object()
        .shape({
          INTEREST: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
          PRINCIPAL: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
        })
        .default(undefined),
      CURRENT: Yup.object()
        .shape({
          INTEREST: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
          PRINCIPAL: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
        })
        .default(undefined),
      OWED: Yup.object()
        .shape({
          INTEREST: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
          PRINCIPAL: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
        })
        .default(undefined),
    }),

    CASH_ADVANCE: Yup.object().shape({
      CURRENT: Yup.object()
        .shape({
          INTEREST: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
          PRINCIPAL: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
        })
        .default(undefined),
      OWED: Yup.object()
        .shape({
          INTEREST: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
          PRINCIPAL: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
        })
        .default(undefined),
    }),

    FEE: Yup.object().shape({
      PREVIOUS: Yup.object()
        .shape({
          INTEREST: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
          PRINCIPAL: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
        })
        .default(undefined),
      CURRENT: Yup.object()
        .shape({
          INTEREST: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
          PRINCIPAL: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
        })
        .default(undefined),
      OWED: Yup.object()
        .shape({
          INTEREST: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
          PRINCIPAL: Yup.number()
            .required()
            .typeError("A number is required")
            .min(0),
        })
        .default(undefined),
    }),
  }),
  interestTiersHelper: Yup.array().when("drawTypes", {
    is: (drawTypes: any) => {
      return (
        drawTypes.includes("PURCHASE") && !drawTypes.includes("CASH_ADVANCE")
      );
    },
    then: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Tier name is required!"),
          PURCHASE: Yup.number().required("This is a required field"),
          FEE: Yup.number().required("This is a required field"),
        })
      )
      // @ts-ignore
      .unique("name", "duplicate name"),
    otherwise: Yup.array().when("drawTypes", {
      is: (drawTypes: any) => {
        return (
          drawTypes.includes("CASH_ADVANCE") && !drawTypes.includes("PURCHASE")
        );
      },
      then: Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required("Tier name is required!"),
            CASH_ADVANCE: Yup.number().required("This is a required field"),
            FEE: Yup.number().required("This is a required field"),
          })
        )
        // @ts-ignore
        .unique("name", "duplicate name"),
      otherwise: Yup.array().when("drawTypes", {
        is: (drawTypes: any) => {
          return (
            !drawTypes.includes("CASH_ADVANCE") &&
            !drawTypes.includes("PURCHASE")
          );
        },
        then: Yup.array()
          .of(
            Yup.object().shape({
              name: Yup.string().required("Tier name is required!"),
              FEE: Yup.number().required("This is a required field"),
            })
          )
          // @ts-ignore
          .unique("name", "duplicate name"),
        otherwise: Yup.array()
          .of(
            Yup.object().shape({
              name: Yup.string().required("Tier name is required!"),
              PURCHASE: Yup.number().required("This is a required field"),
              CASH_ADVANCE: Yup.number().required("This is a required field"),
              FEE: Yup.number().required("This is a required field"),
            })
          )
          // @ts-ignore
          .unique("name", "duplicate name"),
      }),
    }),
  }),
  repaymentDueShiftSetting: Yup.string()
    .oneOf(["NONE", "FORWARD", "BACKWARD"])
    .required("This is a required field")
    .typeError("A value is required"),
  automaticLoadShiftSetting: Yup.string()
    .required("This is a required field")
    .typeError("A value is required"),
});

export const installmentsFormSchema = Yup.object().shape({
  minCreditLimit: Yup.number()
    .required()
    .typeError("A number is required")
    .min(0)
    .lessThan(Yup.ref("maxCreditLimit"), "Must be less than maximum allowed"),
  maxCreditLimit: Yup.number()
    .required()
    .typeError("A number is required")
    .moreThan(0)
    .moreThan(Yup.ref("minCreditLimit"), "Must be more than minimum allowed"),
  minimumPrincipal: Yup.number()
    .required()
    .typeError("A number is required")
    .moreThan(0),
  periodCount: Yup.number()
    .required()
    .typeError("A number is required")
    .min(0),
  firstPaymentDaysOffset: Yup.number()
    .required()
    .typeError("A number is required")
    .min(0),
  periodLength: Yup.string()
    .required()
    .typeError("Enter a valid value"),
});

export const programFormSchema = Yup.object().shape({
  productNameInput: Yup.string().required("This is a required field"),
  partner: Yup.string().required("This is a required field"),
  language: Yup.string().required("This is a required field"),
  location: Yup.string().required("This is a required field"),
  timeZone: Yup.string().required("This is a required field"),
  homeCurrency: Yup.string().required("This is a required field"),
});
