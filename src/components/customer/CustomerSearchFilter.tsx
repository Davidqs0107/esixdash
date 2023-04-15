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

import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import { FormattedMessage, useIntl } from "react-intl";
import BorderlessListItem from "../common/forms/checkboxes/BorderlessListItem";
import InlineCheckbox from "../common/forms/checkboxes/InlineCheckbox";
import Icon from "../common/Icon";
import { CustomerSearchContext } from "../../contexts/CustomerSearchContext";
import Header from "../common/elements/Header";

const CustomerSearchFilter = () => {
  const intl = useIntl();
  const contextValue = useContext(CustomerSearchContext);
  const { programs, banks, partners, filter } = contextValue;

  const handleChange = (
    e: { target: { checked: any; value: any } },
    filterProp: any[]
  ) => {
    const { checked, value } = e.target;
    if (checked) {
      filterProp.push(value);
    } else {
      const index = filterProp.indexOf(value);
      if (index > -1) {
        filterProp.splice(index, 1);
      }
    }
  };

  return (
    <>
      <div className="mt-3 mb-4">
        <Header
          value={intl.formatMessage({
            id: "filters",
            description: "drawer header",
            defaultMessage: "Filters:",
          })}
          level={2}
        />
      </div>
      <Grid container className="SearchFilter">
        <Grid item xs={6} md={2}>
          <span className="header label-regular">
            <img
              className="tenByTen mr-2 mb-1"
              src={Icon.supportIcon}
              alt="icon"
            />
            <FormattedMessage
              id="customerSearch.filter.supportStatus"
              defaultMessage="Support Status"
            />
          </span>
          <List>
            <BorderlessListItem>
              <InlineCheckbox
                id="customerSearch-filter-new"
                value="New"
                func={handleChange}
                filterProp={filter.supportStatus}
                label={
                  <FormattedMessage
                    id="customerSearch.filter.new"
                    defaultMessage="New"
                  />
                }
              />
            </BorderlessListItem>
            <BorderlessListItem>
              <InlineCheckbox
                id="customerSearch-filter-assigned"
                value="Assigned"
                func={handleChange}
                filterProp={filter.supportStatus}
                label={
                  <FormattedMessage
                    id="customerSearch.filter.assigned"
                    defaultMessage="Assigned"
                  />
                }
              />
            </BorderlessListItem>
            <BorderlessListItem>
              <InlineCheckbox
                id="customerSearch-filter-onHold"
                value="On Hold"
                func={handleChange}
                filterProp={filter.supportStatus}
                label={
                  <FormattedMessage
                    id="customerSearch.filter.onHold"
                    defaultMessage="On Hold"
                  />
                }
              />
            </BorderlessListItem>
            <BorderlessListItem>
              <InlineCheckbox
                id="customerSearch-filter-resolved"
                value="Resolved"
                func={handleChange}
                filterProp={filter.supportStatus}
                label={
                  <FormattedMessage
                    id="customerSearch.filter.resolved"
                    defaultMessage="Resolved"
                  />
                }
              />
            </BorderlessListItem>
          </List>
        </Grid>
        <Grid item xs={6} md={2}>
          <span className="header label-regular">
            <img
              className="tenByTen mr-2 mb-1"
              src={Icon.accountIcon}
              alt="icon"
            />
            <FormattedMessage
              id="customerSearch.filter.accountStatus"
              defaultMessage="Account Status"
            />
          </span>
          <List style={{ borderStyle: "none" }}>
            <BorderlessListItem>
              <InlineCheckbox
                id="customerSearch.filter.active"
                value="Active"
                func={handleChange}
                filterProp={filter.accountStatus}
                label={
                  <FormattedMessage
                    id="customerSearch.filter.active"
                    defaultMessage="Active"
                  />
                }
              />
            </BorderlessListItem>
            <BorderlessListItem>
              <InlineCheckbox
                id="customerSearch.filter.inactive"
                value="Inactive"
                func={handleChange}
                filterProp={filter.accountStatus}
                label={
                  <FormattedMessage
                    id="customerSearch.filter.inactive"
                    defaultMessage="Inactive"
                  />
                }
              />
            </BorderlessListItem>
            <BorderlessListItem>
              <InlineCheckbox
                id="customerSearch.filter.inReview"
                value="In Review"
                func={handleChange}
                filterProp={filter.accountStatus}
                label={
                  <FormattedMessage
                    id="customerSearch.filter.inReview"
                    defaultMessage="In Review"
                  />
                }
              />
            </BorderlessListItem>
          </List>
        </Grid>
        <Grid item xs={6} md={2}>
          <span className="header label-regular">
            <img
              className="tenByTen mr-2 mb-1"
              src={Icon.riskIcon}
              alt="icon"
            />
            <FormattedMessage
              id="customerSearch.filter.riskStatus"
              defaultMessage="Risk Status"
            />
          </span>
          <List>
            <BorderlessListItem>
              <InlineCheckbox
                id="customerSearch.filter.low"
                value="Low"
                func={handleChange}
                filterProp={filter.riskStatus}
                label={
                  <FormattedMessage
                    id="customerSearch.filter.low"
                    defaultMessage="Low"
                  />
                }
              />
            </BorderlessListItem>
            <BorderlessListItem>
              <InlineCheckbox
                id="customerSearch.filter.medium"
                value="Medium"
                func={handleChange}
                filterProp={filter.riskStatus}
                label={
                  <FormattedMessage
                    id="customerSearch.filter.medium"
                    defaultMessage="Medium"
                  />
                }
              />
            </BorderlessListItem>
            <BorderlessListItem>
              <InlineCheckbox
                id="customerSearch.filter.high"
                value="High"
                func={handleChange}
                filterProp={filter.riskStatus}
                label={
                  <FormattedMessage
                    id="customerSearch.filter.high"
                    defaultMessage="High"
                  />
                }
              />
            </BorderlessListItem>
          </List>
        </Grid>
        <Grid item xs={6} md={2}>
          <span className="header label-regular">
            <img
              className="tenByTen mr-2 mb-1"
              src={Icon.bankIcon}
              alt="icon"
            />
            <FormattedMessage
              id="customerSearch.filter.banks"
              defaultMessage="Banks"
            />
          </span>
          {banks.length > 0
            ? banks.map((bank: any) => (
                <BorderlessListItem key={`customerSearch.filter.bank.${bank}`}>
                  <InlineCheckbox
                    id={`customerSearch.filter.bank.${bank}`}
                    value={bank}
                    func={handleChange}
                    checked={filter.banks.indexOf(bank) > -1}
                    filterProp={filter.banks}
                    label={bank}
                    key={`customerSearch.filter.bank.${bank}.checkbox`}
                  />
                </BorderlessListItem>
              ))
            : ""}
        </Grid>
        <Grid item xs={6} md={2}>
          <span className="header label-regular">
            <img
              className="tenByTen mr-2 mb-1"
              src={Icon.partnersIcon}
              alt="icon"
            />
            <FormattedMessage
              id="customerSearch.filter.partners"
              defaultMessage="Partners"
            />
          </span>
          {partners.length > 0
            ? partners.map((partner: any) => (
                <BorderlessListItem
                  key={`customerSearch.filter.partner.${partner}`}
                >
                  <InlineCheckbox
                    id={`customerSearch.filter.partner.${partner}`}
                    value={partner}
                    func={handleChange}
                    checked={filter.partners.indexOf(partner) > -1}
                    filterProp={filter.partners}
                    label={partner}
                    key={`customerSearch.filter.partner.${partner}.checkbox`}
                  />
                </BorderlessListItem>
              ))
            : ""}
        </Grid>
        <Grid item xs={6} md={2}>
          <span className="header label-regular">
            <img
              className="tenByTen mr-2 mb-1"
              src={Icon.programsIcon}
              alt="icon"
            />
            <FormattedMessage
              id="customerSearch.filter.programs"
              defaultMessage="Programs"
            />
          </span>
          {programs.length > 0
            ? programs.map((program: any) => (
                <BorderlessListItem
                  key={`customerSearch.filter.program.${program}`}
                >
                  <InlineCheckbox
                    id={`customerSearch.filter.program.${program}`}
                    value={program}
                    func={handleChange}
                    checked={filter.programs.indexOf(program) > -1}
                    filterProp={filter.programs}
                    label={program}
                    key={`customerSearch.filter.program.${program}.checkbox`}
                  />
                </BorderlessListItem>
              ))
            : ""}
        </Grid>
      </Grid>
    </>
  );
};

export default CustomerSearchFilter;
