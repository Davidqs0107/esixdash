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
 */

import React, { useEffect, useState, Suspense, lazy, useContext } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BreadcrumbsNav from "../../components/common/navigation/BreadcrumbsNav";
import Helmet from "react-helmet";
import { defineMessage, useIntl } from "react-intl";
import api from "../../api/api";

// Component State Interface
import { IAudit } from "./IAudit";
import BrandingWrapper from "../../app/BrandingWrapper";
import Header from "../../components/common/elements/Header";
import Typography from "@mui/material/Typography";
import { PartnerUserContext } from "../../contexts/PartnerUserContext";

const AuditDetails = lazy(() => import("./AuditDetails"));
const LoadingScreen = lazy(() => import("../../components/LoadingScreen"));
const AuditFilterForm = lazy(() => import("./AuditFilterForm"));
const AuditFilterTable = lazy(() => import("./AuditFilterTable"));

const Audits: React.FC = () => {
  const partnerUser = useContext(PartnerUserContext);
  const [auditList, setAuditList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState<IAudit["pageSize"]>(20);
  // @ts-ignore
  const [filters, setFilters] = useState<IAudit["filters"]>({
    partnerUser: partnerUser.userName,
    startIndex: 0,
    count: pageSize,
  });
  const [showDetails, setShowDetails] = useState(false);
  const [auditDetailInfo, setAuditDetailsInfo] =
    useState<IAudit["auditDetailInfo"]>();
  const [errors, setErrors] = useState({});
  const intl = useIntl();

  // Customer Search - (customerNumber, { startTime, endTime, count, startIndex, ascending })
  const listAuditsByCustomer = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.LogAPI.searchByCustomer(filters?.customerNumber, filters)
      .then((dataList: any) => {
        // eslint-disable-next-line no-shadow
        const { data, totalCount } = dataList;
        setTotalCount(totalCount);
        setAuditList(data);
      })
      .catch((error: {}) => {
        setErrors(error);
        reset();
      }); // TODO Handle error case

  // Audits by Partner - { partnerUser, startTime, endTime, count, startIndex, ascending }
  const listAuditsByPartnerUser = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.LogAPI.searchByPartnerUser(filters)
      .then((dataList: any) => {
        // eslint-disable-next-line no-shadow
        const { data, totalCount } = dataList;
        setTotalCount(totalCount);
        setAuditList(data);
      })
      .catch((error: {}) => {
        setErrors(error);
        reset();
      }); // TODO Handle error case

  const getPartnerUser = () => {
    // @ts-ignore
    api.CurrentUserAPI.getCurrentUserInfo()
      .then((user: any) => {
        // @ts-ignore
        setFilters({
          partnerUser: user?.userName,
        });
      })
      .catch((error: any) => {
        /* TODO Toast modal error */
      });
  };

  //
  // Sets Detail Component to true sends info to detail component
  //

  const auditDetailSetter = (openDetail: boolean, data: any) => {
    setShowDetails(openDetail);
    setAuditDetailsInfo(data);
  };

  const reset = () => {
    setTotalCount(0);
    setAuditList([]);
  };

  // This triggers on form submission button via AuditFilterForm
  useEffect(() => {
    setShowDetails(false);

    if (filters?.partnerUser) {
      listAuditsByPartnerUser().catch((error: {}) => setErrors(error));
    } else if (filters?.customerNumber) {
      listAuditsByCustomer().catch((error: {}) => setErrors(error));
    } else if (filters?.partnerUser == undefined) {
      getPartnerUser();
    }
  }, [filters]);

  return (
    <div>
      <Suspense fallback={<LoadingScreen />}>
        <Helmet>
          <title>
            {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
              id: "audit",
              defaultMessage: "Audit",
            })}`}
          </title>
        </Helmet>
        <Box>
          <Grid container>
            <Grid item>
              <Header
                value={intl.formatMessage({
                  id: "audit",
                  description: "Audits header",
                  defaultMessage: "Audit",
                })}
                level={1}
                bold
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            flexWrap="nowrap"
            sx={{ marginTop: "50px" }}
          >
            <Grid item sx={{ width: "330px" }}>
              <AuditFilterForm
                setFilters={setFilters}
                filters={filters}
                errors={errors}
              />
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}>
              {!showDetails ? (
                <AuditFilterTable
                  dataList={auditList}
                  pageSize={pageSize}
                  setFilters={setFilters}
                  filters={filters}
                  totalCount={totalCount}
                  setAuditDetails={auditDetailSetter}
                />
              ) : (
                <AuditDetails
                  auditDetailInfo={auditDetailInfo}
                  showSearchList={setShowDetails}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Suspense>
    </div>
  );
};
export default Audits;
