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

import React, { useContext, useState } from "react";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import { FormattedMessage } from "react-intl";
import BorderlessListItem from "../common/forms/checkboxes/BorderlessListItem";
import InlineCheckbox from "../common/forms/checkboxes/InlineCheckbox";
import Pill from "../common/elements/PillLabel";
import Icon from "../common/Icon";
import { CustomerSearchContext } from "../../contexts/CustomerSearchContext";

const CustomerSearchFilterStacked = () => {
  const contextValue = useContext(CustomerSearchContext);
  const { programs, banks, partners, filter, setFilter } = contextValue;

  const [openSupportStatus, setOpenSupportStatus] = useState(
    filter.supportStatus.length > 0
  );
  const [openSupportStatusIcon, setOpenSupportStatusIcon] = useState(
    filter.supportStatus.length > 0 ? Icon.collapseIcon : Icon.expandIcon
  );
  const toggleSupportStatusFilter = () => {
    setOpenSupportStatus(!openSupportStatus);
    setOpenSupportStatusIcon(
      openSupportStatus ? Icon.expandIcon : Icon.collapseIcon
    );
  };
  const [openAccountStatus, setOpenAccountStatus] = useState(
    filter.accountStatus.length > 0
  );
  const [openAccountStatusIcon, setOpenAccountStatusIcon] = useState(
    filter.accountStatus.length > 0 ? Icon.collapseIcon : Icon.expandIcon
  );
  const toggleAccountStatusFilter = () => {
    setOpenAccountStatus(!openAccountStatus);
    setOpenAccountStatusIcon(
      openAccountStatus ? Icon.expandIcon : Icon.collapseIcon
    );
  };
  const [openRiskStatus, setOpenRiskStatus] = useState(
    filter.riskStatus.length > 0
  );
  const [openRiskStatusIcon, setOpenRiskStatusIcon] = useState(
    filter.riskStatus.length > 0 ? Icon.collapseIcon : Icon.expandIcon
  );
  const toggleRiskStatusFilter = () => {
    setOpenRiskStatus(!openRiskStatus);
    setOpenRiskStatusIcon(
      openRiskStatus ? Icon.expandIcon : Icon.collapseIcon
    );
  };
  const [openBanks, setOpenBanks] = useState(filter.banks.length > 0);
  const [openBanksIcon, setOpenBanksIcon] = useState(
    filter.banks.length > 0 ? Icon.collapseIcon : Icon.expandIcon
  );
  const toggleBanksFilter = () => {
    setOpenBanks(!openBanks);
    setOpenBanksIcon(openBanks ? Icon.expandIcon : Icon.collapseIcon);
  };
  const [openPartners, setOpenPartners] = useState(filter.partners.length > 0);
  const [openPartnersIcon, setOpenPartnersIcon] = useState(
    filter.partners.length > 0 ? Icon.collapseIcon : Icon.expandIcon
  );
  const togglePartnersFilter = () => {
    setOpenPartners(!openPartners);
    setOpenPartnersIcon(openPartners ? Icon.expandIcon : Icon.collapseIcon);
  };
  const [openPrograms, setOpenPrograms] = useState(filter.programs.length > 0);
  const [openProgramsIcon, setOpenProgramsIcon] = useState(
    filter.programs.length > 0 ? Icon.collapseIcon : Icon.expandIcon
  );
  const toggleProgramsFilter = () => {
    setOpenPrograms(!openPrograms);
    setOpenProgramsIcon(openPrograms ? Icon.expandIcon : Icon.collapseIcon);
  };

  const newFilter = { ...filter };
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
    setFilter(newFilter);
  };

  return (
    <>
      <div className="SearchFilter">
        <div className="mt-4">
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
            {!openSupportStatus && newFilter.supportStatus.length > 0 ? (
              <Pill
                color="info"
                label={`${newFilter.supportStatus.length} SELECTED`}
              />
            ) : null}
            <div className="float-right">
              <img
                alt="Support Status"
                src={openSupportStatusIcon}
                onClick={toggleSupportStatusFilter}
              />
            </div>
          </span>
          <Collapse in={openSupportStatus}>
            <List>
              <BorderlessListItem>
                <InlineCheckbox
                  id="customerSearch.filter.new"
                  value="New"
                  func={handleChange}
                  checked={newFilter.supportStatus.indexOf("New") > -1}
                  filterProp={newFilter.supportStatus}
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
                  id="customerSearch.filter.assigned"
                  value="Assigned"
                  func={handleChange}
                  checked={newFilter.supportStatus.indexOf("Assigned") > -1}
                  filterProp={newFilter.supportStatus}
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
                  id="customerSearch.filter.onHold"
                  value="On Hold"
                  func={handleChange}
                  checked={newFilter.supportStatus.indexOf("On Hold") > -1}
                  filterProp={newFilter.supportStatus}
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
                  id="customerSearch.filter.resolved"
                  value="Resolved"
                  func={handleChange}
                  checked={newFilter.supportStatus.indexOf("Resolved") > -1}
                  filterProp={newFilter.supportStatus}
                  label={
                    <FormattedMessage
                      id="customerSearch.filter.resolved"
                      defaultMessage="Resolved"
                    />
                  }
                />
              </BorderlessListItem>
            </List>
          </Collapse>
        </div>
        <div className="mt-4">
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
            {!openAccountStatus && newFilter.accountStatus.length > 0 ? (
              <Pill
                color="info"
                label={`${newFilter.accountStatus.length} SELECTED`}
              />
            ) : null}
            <div className="float-right">
              <img
                alt="Account Status"
                src={openAccountStatusIcon}
                onClick={toggleAccountStatusFilter}
              />
            </div>
          </span>
          <Collapse in={openAccountStatus}>
            <List style={{ borderStyle: "none" }}>
              <BorderlessListItem>
                <InlineCheckbox
                  id="customerSearch.filter.active"
                  value="Active"
                  func={handleChange}
                  checked={newFilter.accountStatus.indexOf("Active") > -1}
                  filterProp={newFilter.accountStatus}
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
                  checked={newFilter.accountStatus.indexOf("Inactive") > -1}
                  filterProp={newFilter.accountStatus}
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
                  checked={newFilter.accountStatus.indexOf("In Review") > -1}
                  filterProp={newFilter.accountStatus}
                  label={
                    <FormattedMessage
                      id="customerSearch.filter.inReview"
                      defaultMessage="In Review"
                    />
                  }
                />
              </BorderlessListItem>
            </List>
          </Collapse>
        </div>
        <div className="mt-4">
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
            {!openRiskStatus && newFilter.riskStatus.length > 0 ? (
              <Pill
                color="info"
                label={`${newFilter.riskStatus.length} selected`}
              />
            ) : null}
            <div className="float-right">
              <img
                alt="Risk Status"
                src={openRiskStatusIcon}
                onClick={toggleRiskStatusFilter}
              />
            </div>
          </span>
          <Collapse in={openRiskStatus}>
            <List>
              <BorderlessListItem>
                <InlineCheckbox
                  id="customerSearch.filter.low"
                  value="Low"
                  func={handleChange}
                  checked={newFilter.riskStatus.indexOf("Low") > -1}
                  filterProp={newFilter.riskStatus}
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
                  checked={newFilter.riskStatus.indexOf("Medium") > -1}
                  filterProp={newFilter.riskStatus}
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
                  checked={newFilter.riskStatus.indexOf("High") > -1}
                  filterProp={newFilter.riskStatus}
                  label={
                    <FormattedMessage
                      id="customerSearch.filter.high"
                      defaultMessage="High"
                    />
                  }
                />
              </BorderlessListItem>
            </List>
          </Collapse>
        </div>
        <div className="mt-4">
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
            {!openBanks && newFilter.banks.length > 0 ? (
              <Pill color="info" label={`${newFilter.banks.length} SELECTED`} />
            ) : null}
            <div className="float-right">
              <img src={openBanksIcon} onClick={toggleBanksFilter} />
            </div>
          </span>
          <Collapse in={openBanks}>
            <List>
              {banks.length > 0
                ? banks.map((bank: any) => (
                    <BorderlessListItem
                      key={`customerSearch.filter.bank.${bank}`}
                    >
                      <InlineCheckbox
                        id={`customerSearch.filter.bank.${bank}`}
                        value={bank}
                        func={handleChange}
                        checked={newFilter.banks.indexOf(bank) > -1}
                        filterProp={newFilter.banks}
                        label={bank}
                        key={`customerSearch.filter.bank.${bank}.checkbox`}
                      />
                    </BorderlessListItem>
                  ))
                : null}
            </List>
          </Collapse>
        </div>
        <div className="mt-4">
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
            {!openPartners && newFilter.partners.length > 0 ? (
              <Pill
                color="info"
                label={`${newFilter.partners.length} SELECTED`}
              />
            ) : null}
            <div className="float-right">
              <img src={openPartnersIcon} onClick={togglePartnersFilter} />
            </div>
          </span>
          <Collapse in={openPartners}>
            <List>
              {partners.length > 0
                ? partners.map((partner: any) => (
                    <BorderlessListItem
                      key={`customerSearch.filter.partner.${partner}`}
                    >
                      <InlineCheckbox
                        id={`customerSearch.filter.partner.${partner}`}
                        value={partner}
                        func={handleChange}
                        checked={newFilter.partners.indexOf(partner) > -1}
                        filterProp={newFilter.partners}
                        label={partner}
                        key={`customerSearch.filter.partner.${partner}.checkbox`}
                      />
                    </BorderlessListItem>
                  ))
                : null}
            </List>
          </Collapse>
        </div>
        <div className="mt-4">
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
            {!openPrograms && newFilter.programs.length > 0 ? (
              <Pill
                color="info"
                label={`${newFilter.programs.length} SELECTED`}
              />
            ) : null}
            <div className="float-right">
              <img src={openProgramsIcon} onClick={toggleProgramsFilter} />
            </div>
          </span>
          <Collapse in={openPrograms}>
            <List>
              {programs.length > 0
                ? programs.map((program: any) => (
                    <BorderlessListItem
                      key={`customerSearch.filter.program.${program}`}
                    >
                      <InlineCheckbox
                        id={`customerSearch.filter.program.${program}`}
                        value={program}
                        func={handleChange}
                        checked={newFilter.programs.indexOf(program) > -1}
                        filterProp={newFilter.programs}
                        label={program}
                        key={`customerSearch.filter.program.${program}.checkbox`}
                      />
                    </BorderlessListItem>
                  ))
                : null}
            </List>
          </Collapse>
        </div>
      </div>
    </>
  );
};

export default CustomerSearchFilterStacked;
