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

export const toCustomerUI = (customerList: {
  count?: number;
  startIndex?: number;
  endIndex?: number;
  lastPage?: boolean;
  totalCount?: number;
  data: any;
}) => {
  const buildName = (customer: {
    person: { firstName: any; lastName: any };
  }) => {
    const list = Array.of(customer.person.firstName, customer.person.lastName);
    return list
      .map((item) => (item !== null && item !== undefined ? item : ""))
      .join(" ")
      .trim();
  };

  const findPhone = (phones: any[] | null | undefined) =>
    (phones !== null && phones !== undefined && phones.length > 0
      ? phones.map((phone) => `+${phone.countryCode} ${phone.phoneNumber}`)
      : "")[0];

  const findEmail = (emails: any[]) =>
    emails.map((email) =>
      email !== null && email !== undefined ? email.email : ""
    )[0];

  const findCity = (address: { city: any } | null | undefined) =>
    address !== null && address !== undefined ? address.city : "";

  const findCountry = (address: { country: any } | null | undefined) =>
    address !== null && address !== undefined ? address.country : "";

  const findPostal = (address: { postalCode: any } | null | undefined) =>
    address !== null && address !== undefined ? address.postalCode : "";

  const formatAddress = (address: any) => {
    if (address) {
      let lines = [
        address.line1 || "",
        address.line2 || "",
        address.line3 || "",
        address.neighborhood || "",
        address.city,
        address.state,
        address.postalCode,
      ];
      lines = lines.filter((e) => String(e).trim());
      return lines.join(", ") + " " + address.country;
    }
    return "";
  };

  return customerList.data.map(
    (customer: {
      customerNumber: any;
      person: { lastName: any; firstName: any };
      programName: any;
      phones: any;
      emails: any;
      address: any;
      rootCustomer: any;
    }) => ({
      id: customer.customerNumber,
      familyName: customer.person.lastName,
      givenName: customer.person.firstName,
      program: customer.programName,
      contact: findPhone(customer.phones),
      email: findEmail(customer.emails),
      city: findCity(customer.address),
      country: findCountry(customer.address),
      postal: findPostal(customer.address),
      rootCustomer: customer.rootCustomer,
      address: customer.address,
      formattedAddress: formatAddress(customer.address),
    })
  );
};

export default toCustomerUI;
