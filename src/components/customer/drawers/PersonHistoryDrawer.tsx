/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * THIS IS CONFIDENTIAL AND PROPRIETARY TO EPISODE SIX, and any
 * copying, reproduction, redistribution, dissemination, modification, or
 * other use, in whole or in part, is strictly prohibited without the prior
 * written consent of (or as may be specifically permitted in a fully signed
 * agreement with) Episode Six.   Violations may result in severe civil and/or
 * criminal penalties, and Episode Six will enforce its rights to the maximum
 * extent permitted by law.
 *
 */

import {
  FormattedDate,
  FormattedMessage,
  FormattedTime,
  useIntl,
} from "react-intl";
import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextRender from "../../common/TextRender";
import Header from "../../common/elements/Header";
import Icon from "../../common/Icon";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import moment from "moment/moment";
import AddressTypeConverter from "../../common/converters/AddressTypeConverter";
import EmailStateConverter from "../../common/converters/EmailStateConverter";
import InternationalizeEmailType from "../../common/converters/EmailTypesI18nMap";
import InternationalizePhoneType from "../../common/converters/PhoneTypesI18nMap";
import OfficialIdTypeConverter from "../../common/converters/OfficialIdTypeConverter";
import api from "../../../api/api";
import { MessageContext } from "../../../contexts/MessageContext";
import { ContentVisibilityContext } from "../../../contexts/ContentVisibilityContext";

interface IPersonDetailsHistory {
  personId: string;
  name: any;
  emails: any;
  phones: any;
  addresses: any;
  identifications: any;
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  background: "transparent",
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <img src={Icon.caretRightWhite} alt="close icon" height={11} width={11} />
    }
    {...props}
  />
))(({ theme }) => ({
  padding: 0,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    padding: 0,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  paddingLeft: "36px",
}));

interface ILabel {
  children: React.ReactNode;
}

const Label: React.FC<ILabel> = ({ children }) => {
  return (
    <Typography
      sx={{
        fontSize: "8px",
        color: "#8995AD !important",
        marginBottom: "2px !important",
      }}
    >
      {children}
    </Typography>
  );
};

const PersonHistoryDrawer: React.FC<IPersonDetailsHistory> = ({
  personId,
  name,
  emails,
  phones,
  addresses,
  identifications,
}) => {
  const intl = useIntl();
  const [expanded, setExpanded] = useState<string | false>();
  const { setErrorMsg } = useContext(MessageContext);
  const {
    canManagePerson,
    canManagePhoneNumber,
    canManageEmailAddress,
    canManageGeographicalAddress,
    canManageOfficialID,
  } = useContext(ContentVisibilityContext);
  const [nameHistory, setNameHistory] = useState([]);
  const [phoneHistory, setPhoneHistory] = useState([]);
  const [emailHistory, setEmailHistory] = useState([]);
  const [addressHistory, setAddressHistory] = useState([]);
  const [identificationHistory, setIdentificationHistory] = useState([]);

  const getNameHistory = (personIdentifier: string) =>
    // @ts-ignore
    api.PersonAPI.getNameHistory(personIdentifier).catch((error: any) =>
      setErrorMsg(error)
    );
  const getPhoneHistory = (personIdentifier: string) =>
    // @ts-ignore
    api.PersonAPI.getPhoneHistory(personIdentifier).catch((error: any) =>
      setErrorMsg(error)
    );
  const getEmailHistory = (personIdentifier: string) =>
    // @ts-ignore
    api.PersonAPI.getEmailHistory(personIdentifier).catch((error: any) =>
      setErrorMsg(error)
    );
  const getAddressHistory = (personIdentifier: string) =>
    // @ts-ignore
    api.PersonAPI.getAddressHistory(personIdentifier).catch((error: any) =>
      setErrorMsg(error)
    );
  const getIdentificationHistory = (personIdentifier: string) =>
    // @ts-ignore
    api.PersonAPI.getIdentificationHistory(personIdentifier).catch(
      (error: any) => setErrorMsg(error)
    );

  const getCustomerInfo = () => {
    const promises = [
      canManagePerson ? getNameHistory(personId) : [],
      canManagePhoneNumber ? getPhoneHistory(personId) : [],
      canManageEmailAddress ? getEmailHistory(personId) : [],
      canManageGeographicalAddress ? getAddressHistory(personId) : [],
      canManageOfficialID ? getIdentificationHistory(personId) : [],
    ];

    Promise.all(promises).then((results) => {
      setNameHistory(results[0]);
      setPhoneHistory(results[1]);
      setEmailHistory(results[2]);
      setAddressHistory(results[3]);
      setIdentificationHistory(results[4]);
    });
  };

  useEffect(() => {
    getCustomerInfo();
  }, []);

  const allHistory = [
    ...nameHistory.map((v: any) => ({ ...v, source: "name" })),
    ...phoneHistory.map((v: any) => ({ ...v, source: "phoneNumber" })),
    ...emailHistory.map((v: any) => ({ ...v, source: "emailAddress" })),
    ...addressHistory.map((v: any) => ({ ...v, source: "address" })),
    ...identificationHistory.map((v: any) => ({
      ...v,
      source: "identification",
    })),
  ];
  const sortedHistory = allHistory.sort(
    (a, b) => b.modifiedTime - a.modifiedTime
  );

  const handleChangeAccordion =
    (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const renderName = (item: any) => {
    return (
      <>
        {item.title && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="title" defaultMessage="Title" />
            </Label>
            <TextRender
              data={item.title}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.firstName && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="givenName" defaultMessage="Given name" />
            </Label>
            <TextRender
              data={item.firstName}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.middleName && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="middleName" defaultMessage="Middle name" />
            </Label>
            <TextRender
              data={item.middleName}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.lastName && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="familyName" defaultMessage="Family name" />
            </Label>
            <TextRender
              data={item.lastName}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.lastName2 && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage
                id="secondFamilyName"
                defaultMessage="Second Family Name"
              />
            </Label>
            <TextRender
              data={item.lastName2}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.suffix && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="suffix" defaultMessage="Suffix" />
            </Label>
            <TextRender
              data={item.suffix}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.nickname && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="nickname" defaultMessage="Nickname" />
            </Label>
            <TextRender
              data={item.nickname}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.gender && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Box>
              <Label>
                <FormattedMessage id="gender" defaultMessage="Gender" />
              </Label>
            </Box>
            <TextRender
              data={item.gender}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.dob && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage
                id="dateOfBirth"
                defaultMessage="Date of Birth"
              />
            </Label>
            <TextRender
              data={moment(item.dob).format("MMM D, YYYY")}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
      </>
    );
  };

  const renderAddress = (item: any) => {
    return (
      <>
        {item.type && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="type" defaultMessage="Type" />
            </Label>
            <TextRender
              data={AddressTypeConverter(item.type, intl)}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.line1 && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage
                id="addressLine1"
                defaultMessage="Address Line 1"
              />
            </Label>
            <TextRender
              data={item.line1}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.line2 && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage
                id="addressLine2"
                defaultMessage="Address Line 2"
              />
            </Label>
            <TextRender
              data={item.line2}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.line3 && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage
                id="addressLine3"
                defaultMessage="Address Line 3"
              />
            </Label>
            <TextRender
              data={item.line3}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.neighborhood && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage
                id="neighborhood"
                defaultMessage="Neighborhood"
              />
            </Label>
            <TextRender
              data={item.neighborhood}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.postalCode && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="postalCode" defaultMessage="Postal Code" />
            </Label>
            <TextRender
              data={item.postalCode}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.city && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="city" defaultMessage="City" />
            </Label>
            <TextRender
              data={item.city}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.state && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="state" defaultMessage="State" />
            </Label>
            <TextRender
              data={item.state}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.country && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="country" defaultMessage="Country" />
            </Label>
            <TextRender
              data={item.country}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
      </>
    );
  };

  const renderEmailAddress = (item: any) => {
    return (
      <>
        {item.type && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="emailType" defaultMessage="Email Type" />
            </Label>
            <TextRender
              data={InternationalizeEmailType(item.type, intl)}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.email && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage
                id="emailAddress"
                defaultMessage="Email Address"
              />
            </Label>
            <TextRender
              data={item.email}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.state && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="emailState" defaultMessage="Email State" />
            </Label>
            <TextRender
              data={EmailStateConverter(item.state, intl)}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
      </>
    );
  };

  const renderPhoneNumber = (item: any) => {
    return (
      <>
        {item.type && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="phoneType" defaultMessage="Phone Type" />
            </Label>
            <TextRender
              data={InternationalizePhoneType(item.type, intl)}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.phoneNumber && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage
                id="phoneNumber"
                defaultMessage="Phone Number"
              />
            </Label>
            <TextRender
              data={item.phoneNumber}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
      </>
    );
  };

  const renderIdentification = (item: any) => {
    return (
      <>
        {item.type && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="IDType" defaultMessage="ID Type" />
            </Label>
            <TextRender
              data={OfficialIdTypeConverter(item.type, intl)}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.primary && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage
                id="primaryNumber"
                defaultMessage="Primary Number"
              />
            </Label>
            <TextRender
              data={item.primary}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.secondary && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage
                id="secondaryNumber"
                defaultMessage="Secondary Number"
              />
            </Label>
            <TextRender
              data={item.secondary}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
        {item.issuanceDate && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage id="issuedDate" defaultMessage="Issued Date" />
            </Label>
            <Typography
              sx={{ color: "#FFFFF", marginBottom: "0px !important" }}
            >
              <FormattedDate
                value={moment(item.issuanceDate, "YYYYMMDD").toDate()}
                dateStyle="long"
              />
            </Typography>
          </Box>
        )}
        {item.expirationDate && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage
                id="expirationDate"
                defaultMessage="Expiration Date"
              />
            </Label>
            <Typography
              sx={{ color: "#FFFFF", marginBottom: "0px !important" }}
            >
              <FormattedDate
                value={moment(item.expirationDate, "YYYYMMDD").toDate()}
                dateStyle="long"
              />
            </Typography>
          </Box>
        )}
        {item.country && (
          <Box sx={{ display: "grid", marginBottom: "20px" }}>
            <Label>
              <FormattedMessage
                id="IDIssuerCountry"
                defaultMessage="ID Issuer (Country)"
              />
            </Label>
            <TextRender
              data={item.country}
              className="drawer-label"
              truncateAt={100}
              color="labelLight"
              noMargin
            />
          </Box>
        )}
      </>
    );
  };

  const formatContent = (item: any) => {
    let value = "";
    switch (item.source) {
      case "name":
        value = `${item.firstName} ${item.lastName}`;
        break;
      case "emailAddress":
        value = `${item.email}`;
        break;
      case "phoneNumber":
        value = `+${item.countryCode} ${item.phoneNumber}`;
        break;
      case "address":
        const { line1, line2, line3 } = item;
        const lines = [line1, line2 || "", line3 || ""].filter((e) =>
          String(e).trim()
        );
        value = lines.join(", ");
        break;
      case "identification":
        value = `${item.primary}`;
        break;
    }

    let action = "";
    if (item.creationTime === item.modifiedTime) {
      action = "Added";
    } else {
      switch (item.source) {
        case "name":
          action = name.firstName || name.lastName ? "Updated" : "Deleted";
          break;
        case "emailAddress":
          action = emails.find((i: any) => i.email == item.email)
            ? "Updated"
            : "Deleted";
          break;
        case "phoneNumber":
          action = phones.find((i: any) => i.phoneNumber == item.phoneNumber)
            ? "Updated"
            : "Deleted";
          break;
        case "address":
          action = addresses.find(
            (i: any) =>
              i.line1 == item.line1 ||
              i.line2 == item.line2 ||
              i.line3 == item.line3
          )
            ? "Updated"
            : "Deleted";
          break;
        case "identification":
          action = identifications.find((i: any) => i.primary == item.primary)
            ? "Updated"
            : "Deleted";
          break;
      }
    }

    const actionLabel =
      action == "Deleted"
        ? `${intl.formatMessage({
            id: `text.deleted`,
            defaultMessage: "deleted",
          })}`
        : `${intl.formatMessage({
            id: `modifiedOrCreated`,
            defaultMessage: "modified or created",
          })}`;

    let source = item.source;
    if (item.source == "name") {
      source = "person";
    } else if (item.source == "identification") {
      source = "officialId";
    }

    return {
      action: action,
      content: ` ${intl.formatMessage({
        id: `${source}`,
        defaultMessage: source,
      })} ${actionLabel} `,
    };
  };

  const renderIcon = (action: string, source: string) => {
    let icon = undefined;
    switch (source) {
      case "name":
        icon = Icon.pencilWithCirleWhite;
        break;
      case "emailAddress":
        switch (action) {
          case "Added":
            icon = Icon.pencilWithCirleWhite;
            break;
          case "Updated":
            icon = Icon.pencilWithCirleWhite;
            break;
          case "Deleted":
            icon = Icon.minusWithCircleWhite;
            break;
        }
        break;
      case "phoneNumber":
        switch (action) {
          case "Added":
            icon = Icon.pencilWithCirleWhite;
            break;
          case "Updated":
            icon = Icon.pencilWithCirleWhite;
            break;
          case "Deleted":
            icon = Icon.minusWithCircleWhite;
            break;
        }
        break;
      case "address":
        switch (action) {
          case "Added":
            icon = Icon.pencilWithCirleWhite;
            break;
          case "Updated":
            icon = Icon.pencilWithCirleWhite;
            break;
          case "Deleted":
            icon = Icon.minusWithCircleWhite;
            break;
        }
        break;
      case "identification":
        switch (action) {
          case "Added":
            icon = Icon.pencilWithCirleWhite;
            break;
          case "Updated":
            icon = Icon.pencilWithCirleWhite;
            break;
          case "Deleted":
            icon = Icon.minusWithCircleWhite;
            break;
        }
        break;
    }

    return (
      <img
        width="19px"
        height="19px"
        src={icon}
        alt={`icon for ${action} ${source}`}
      />
    );
  };

  return (
    <Container style={{ width: "400px" }}>
      <Header
        level={2}
        bold
        color="white"
        drawerTitle
        value={intl.formatMessage({
          id: "personChangeHistory",
          description: "drawer header",
          defaultMessage: "Person Change History",
        })}
      />
      <Box>
        {sortedHistory.map((item: any) => {
          const { action, content } = formatContent(item);
          return (
            <>
              <Accordion
                expanded={expanded === `${item.id}-${item.source}-Panel`}
                onChange={handleChangeAccordion(
                  `${item.id}-${item.source}-Panel`
                )}
              >
                <AccordionSummary
                  aria-controls={`${item.id}d-content`}
                  id={`${item.id}d-header}`}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "end",
                      }}
                    >
                      <Box sx={{ marginRight: "16px" }}>
                        {renderIcon(action, item.source)}
                      </Box>
                      <Box sx={{ display: "grid" }}>
                        <Box>
                          <Label>
                            <FormattedTime
                              value={new Date(item.modifiedTime)}
                              year="numeric"
                              month="long"
                              day="2-digit"
                            />
                          </Label>
                        </Box>
                        <TextRender
                          data={content}
                          className="drawer-label"
                          truncateAt={100}
                          color="labelLight"
                          noMargin
                        />
                      </Box>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {item.source == "name" && renderName(item)}
                  {item.source == "address" && renderAddress(item)}
                  {item.source == "emailAddress" && renderEmailAddress(item)}
                  {item.source == "phoneNumber" && renderPhoneNumber(item)}
                  {item.source == "identification" &&
                    renderIdentification(item)}
                </AccordionDetails>
              </Accordion>
            </>
          );
        })}
      </Box>
    </Container>
  );
};

export default PersonHistoryDrawer;
