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

import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import Header from "../../common/elements/Header";
import TextRender from "../../common/TextRender";
import Label from "../../common/elements/Label";
import CardStateConverter from "../../common/converters/CardStateConverter";

interface IDrawerCardDetails {
  card: any;
  countryName?: string;
}

const DrawerCardDetails: React.FC<IDrawerCardDetails> = ({
  card,
  countryName,
}) => {
  const intl = useIntl();
  const { shippingAddress } = card.cardOrderInfo;
  const cityAddress = () => {
    if (shippingAddress) {
      const neighborhood = shippingAddress.neighborhood || "";
      let address = [
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postalCode,
      ];
      address = address.filter((e) => String(e).trim());
      return `${neighborhood}${neighborhood ? ", " : ""}${address.join(", ")}`;
    }
    return "";
  };

  console.log(card.cardOrderInfo.state, card.cardOrderInfo.state.toUpperCase());

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          value={intl.formatMessage({
            id: "orderDetails",
            defaultMessage: "Order Details",
          })}
          bold
          color="white"
        />
      </Box>
      <Grid
        container
        sx={{ marginBottom: "20px", rowGap: "6px" }}
        rowSpacing={1}
        flexDirection="column"
      >
        <Label variant="grey" fontWeight={400}>
          <FormattedMessage
            id="drawer.card.details.status"
            description="Card program name"
            defaultMessage="Status"
          />
        </Label>
        <TextRender
          data={CardStateConverter(card.state.toUpperCase(), intl)}
          textTransform="capitalize"
          fontWeight={400}
        />
      </Grid>
      {shippingAddress && (
        <>
          <Grid
            container
            sx={{ marginBottom: "20px", rowGap: "6px" }}
            rowSpacing={1}
            flexDirection="column"
          >
            <Label variant="grey" fontWeight={400}>
              <FormattedMessage
                id="drawer.card.details.created"
                description="Created Time"
                defaultMessage="Created"
              />
            </Label>
            <Typography fontWeight={400}>
              <FormattedDate
                value={new Date(card.creationTime)}
                year="numeric"
                month="long"
                day="2-digit"
              />
            </Typography>
          </Grid>
          <Grid
            container
            sx={{ marginBottom: "20px", rowGap: "6px" }}
            rowSpacing={1}
            flexDirection="column"
          >
            <Label variant="grey" fontWeight={400}>
              <FormattedMessage
                id="drawer.card.details.modified"
                description="Last Modified"
                defaultMessage="Last Modified"
              />
            </Label>
            <Typography fontWeight={400}>
              <FormattedDate
                value={new Date(card.modifiedTime)}
                year="numeric"
                month="long"
                day="2-digit"
              />
            </Typography>
          </Grid>
          <Grid
            container
            sx={{ marginBottom: "20px", rowGap: "6px" }}
            rowSpacing={1}
            flexDirection="column"
          >
            <Label variant="grey" fontWeight={400}>
              <FormattedMessage
                id="drawer.card.details.address"
                description="Address"
                defaultMessage="Address"
              />
            </Label>
            <Box>
              {shippingAddress.line1 && (
                <TextRender
                  data={shippingAddress.line1}
                  truncated={false}
                  fontWeight={400}
                />
              )}
              {shippingAddress.line2 && (
                <TextRender
                  data={shippingAddress.line2}
                  truncated={false}
                  fontWeight={400}
                />
              )}
              {shippingAddress.line3 && (
                <TextRender
                  data={shippingAddress.line3}
                  truncated={false}
                  fontWeight={400}
                />
              )}
              <TextRender
                data={cityAddress()}
                truncated={false}
                fontWeight={400}
              />
              {countryName && (
                <>
                  {" "}
                  <TextRender
                    data={countryName}
                    truncated={false}
                    fontWeight={400}
                  />
                </>
              )}
            </Box>
          </Grid>
        </>
      )}
      {card.cardOrderInfo.attributes.length > 0 && (
        <Grid item>
          <Label variant="grey" fontWeight={400}>
            <FormattedMessage
              id="additionalAttributes"
              description="Additional Attributes"
              defaultMessage="Additional Attributes"
            />
          </Label>
          {card.cardOrderInfo.attributes.map((attribute: any) => (
            <Box sx={{ mt: 2 }}>
              <Grid container flexDirection="column">
                <Label variant="grey" fontWeight={400}>
                  {attribute.name}
                </Label>
                <Label>
                  <TextRender
                    data={attribute.value}
                    truncated={false}
                    fontWeight={400}
                  />
                </Label>
              </Grid>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DrawerCardDetails;
