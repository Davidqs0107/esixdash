/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * THIS IS CONFIDENTIAL AND PROPRIETARY TO EPISODE SIX, and any
 * copying, reproduction, redistribution, dissemination, modification, or
 * other use, in whole or in part, is strictly prohibited without the prior
 * written consent of (or as may be specifically permitted in a fully signed
 * agreement with) Episode Six.   Violations may result in severe civil and/or
 * criminal penalties, and Episode Six will enforce its rights to the maximum
 * extent permitted by law.
 */

import React, { PropsWithChildren } from "react";
import { defineMessage, useIntl } from "react-intl";
import Box from "@mui/material/Box";
import QDButton from "./QDButton";

interface IWizard {
  activeStep: number;
  handleBack?: any;
  handleChange?: any;
  handleFinish?: any;
  handleIsStepOptional?: any;
  handleIsStepSkipped?: any;
  handleNext?: any;
  handleReset?: any;
  handleSkip?: any;
  showButtons?: boolean;
  showStepper?: boolean;
  steps: string[];
}

const QDWizard: React.FC<IWizard> = (props: PropsWithChildren<IWizard>) => {
  const intl = useIntl();

  return (
    <Box sx={{ width: "100%" }}>
      {props.showStepper && (
        <div
          style={{
            display: "flex",
            borderRadius: "10px",
            backgroundColor: "#E4E8EF",
            width: "fit-content",
            height: "20px",
          }}
        >
          {props.steps.map((text: string, index: number) => {
            const style = {
              fontSize: "12px",
              letterSpacing: "-0.2px",
              lineHeight: "16px",
              marginBottom: "0",
              padding: "2px 10px",
              borderRadius: "10px",
              backgroundColor: "#E4E8EF",
              color: "#FFFFFF",
            };

            if (index < props.activeStep) {
              style.color = "#515969";
            }

            if (props.activeStep === index) {
              style.backgroundColor = "#433AA8";
            }
            return <label style={style} key={'step'+index}>{text}</label>;
          })}
        </div>
      )}
      <div>
        <div>
          {React.Children.map(
            props.children,
            (pane: any, idx: number) => idx === props.activeStep && pane
          )}

          {props.showButtons && (
            <div>
              <hr style={{ marginTop: 15 }} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <QDButton
                    onClick={props.handleBack}
                    id="wizard-button-back"
                    variant="contained"
                    className="ml-0"
                    disabled={props.activeStep === 0}
                    label={intl.formatMessage(
                      defineMessage({
                        id: "wizard.button.back",
                        defaultMessage: "Back",
                        description: "Back button",
                      })
                    )}
                    size="small"
                  />

                  {props.handleIsStepOptional(props.activeStep) && (
                    <QDButton
                      onClick={props.handleSkip}
                      id="wizard-button-skip"
                      color="primary"
                      variant="contained"
                      disabled={props.activeStep === 0}
                      label={intl.formatMessage(
                        defineMessage({
                          id: "wizard.button.skip",
                          defaultMessage: "Skip",
                          description: "Skip button",
                        })
                      )}
                      size="small"
                    />
                  )}
                </div>

                <QDButton
                  disabled={!props.handleChange()}
                  onClick={
                    props.activeStep === props.steps.length - 1
                      ? props.handleFinish
                      : props.handleNext
                  }
                  id="wizard-button-next"
                  color="primary"
                  variant="contained"
                  className="mr-0"
                  label={intl.formatMessage(
                    defineMessage({
                      id:
                        props.activeStep === props.steps.length - 1
                          ? "wizard.button.finish"
                          : "wizard.button.next",
                      defaultMessage:
                        props.activeStep === props.steps.length - 1
                          ? "Finish"
                          : "Next",
                      description: "Next or Finish button",
                    })
                  )}
                  size="small"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
};

QDWizard.defaultProps = {
  activeStep: 0,
  handleChange: true,
  showButtons: true,
  showStepper: true,
};

export default QDWizard;
