/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import StandardTable from "../../components/common/table/StandardTable";
import api from "../../api/api";
import TextRender from "../../components/common/TextRender";
import DrawerComp from "../../components/common/DrawerComp";
import UserDrawer from "../../components/users/drawers/UserDrawer";
import emitter from "../../emitter";
import TableCellAccordion from "../../components/common/forms/accordions/TableCellAccordion";
import { MessageContext } from "../../contexts/MessageContext";
import { ContentVisibilityContext } from "../../contexts/ContentVisibilityContext";
import UsersEvent from "./UserEvents";
import BrandingWrapper from "../../app/BrandingWrapper";
import RoleConverter from "../../components/common/converters/RoleConverter";
import DateAndTimeConverter from "../../components/common/converters/DateAndTimeConverter";
import Toggle from "../../components/common/forms/checkboxes/Toggle";

const Users: React.FC = () => {
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const { canLockUser } = useContext(ContentVisibilityContext);
  const userSearchPageSize = 10;
  // eslint-disable-next-line max-len
  const [userSearchDto, setUserSearchDto] = useState({
    startIndex: 0,
    count: userSearchPageSize,
    inactiveLast: true,
  });
  const [userInfoList, setUserInfoList] = useState([]);
  const intl = useIntl();

  const paginationInitialState = {
    /* size of pagination link at the top of the table */
    paginationSize: 5,
    currentPage: 0,
    /* startIndex and endIndex are used to determine the
    first and last entry numbers of the pagination display */
    startIndex: 0,
    endIndex: 5,
    /* rangeStart and range End are used in "Showing 1-10 of 100" */
    rangeStart: 1,
    rangeEnd: 10,

    /* how many rows in each page */
    pageSize: 10,
    /* total number of pages */
    pagesCount: 0,
    /* total number of rows */
    totalCount: 0,
  };

  const [offsetPaginationElements, setOffsetPaginationElements] = useState(
    paginationInitialState
  );

  const buildUserList = (data: any) => {
    const separator = {
      id: "SEPARATOR 6",
    };

    let firstInactive = true;
    const list: any = [];
    data.forEach((user: any) => {
      if (user.state === "inactive" && firstInactive) {
        list.push(separator);
        firstInactive = false;
      }
      list.push(user);
    });

    setUserInfoList(list);
  };

  const getUserInfos = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.UserAPI.list(userSearchDto)
      .then((users: any) => {
        const { data } = users;
        setOffsetPaginationElements({
          ...offsetPaginationElements,
          totalCount: users.totalCount,
          pagesCount: Math.ceil(users.totalCount / 10),
        });
        buildUserList(data);
      })
      .catch((error: any) => setErrorMsg(error));
  };

  const toggleStatus = (userID: string, state: string, callback: Function) => {
    if (state === "active") {
      // @ts-ignore
      api.UserAPI.blockUser(userID)
        .then(() => {
          setTimeout(() => {
            // timeout for smoother success message display
            setSuccessMsg({
              responseCode: "200000",
              message: intl.formatMessage({
                id: "user.unlocked.successful",
                defaultMessage: "User was locked successfully",
              }),
            });
          }, 300);
          callback && callback("locked");
        })
        .catch((error: any) => setErrorMsg(error));
    } else {
      // @ts-ignore
      api.UserAPI.unlockUser(userID)
        .then(() => {
          setTimeout(() => {
            setSuccessMsg({
              responseCode: "200000",
              message: intl.formatMessage({
                id: "user.unlocked.successful",
                defaultMessage: "User was unlocked successfully",
              }),
            });
          }, 300);
          callback && callback("active");
        })
        .catch((error: any) => setErrorMsg(error));
    }
  };

  const userInfoMetadata = [
    {
      width: "19%",
      header: (
        <FormattedMessage
          id="username"
          description="The user's username"
          defaultMessage="Username"
        />
      ),
      render: (rowData: any) => {
        const { userName } = rowData;
        return (
          <DrawerComp
            label={`@${userName}`}
            asLink
            id="users-drawer-edit"
            overrideWidth
            widthPercentage={20}
          >
            <UserDrawer user={rowData} edit />
          </DrawerComp>
        );
      },
    },
    {
      width: "19%",
      header: (
        <FormattedMessage
          id="givenName"
          description="User's given name"
          defaultMessage="Given Name"
        />
      ),
      render: (rowData: any) => {
        const {
          person: { firstName },
        } = rowData;
        return <TextRender data={firstName} />;
      },
    },
    {
      width: "19%",
      header: (
        <FormattedMessage
          id="familyName"
          description="User's family name"
          defaultMessage="Family Name"
        />
      ),
      render: (rowData: any) => {
        const {
          person: { lastName },
        } = rowData;
        return <TextRender data={lastName} />;
      },
    },
    {
      width: "19%",
      header: (
        <FormattedMessage
          id="roles"
          description="User's roles"
          defaultMessage="Roles"
        />
      ),
      render: (rowData: any) => {
        const { roles } = rowData;
        return (
          <>
            <List>
              {roles !== undefined && roles.length > 0 ? (
                <li>
                  <TextRender data={RoleConverter(roles[0].name, intl)} />
                </li>
              ) : null}
            </List>
            {roles !== undefined && roles.length > 1 ? (
              <TableCellAccordion
                showNumber={roles.length}
                hideNumber={roles.length - 1}
              >
                <List>
                  {roles.map((role: any, idx: number) =>
                    idx > 0 ? (
                      <li>
                        <TextRender data={RoleConverter(role.name, intl)} />
                      </li>
                    ) : null
                  )}
                </List>
              </TableCellAccordion>
            ) : null}
          </>
        );
      },
    },
    {
      width: "19%",
      header: (
        <FormattedMessage
          id="lastLogin"
          description="User's last login time"
          defaultMessage="Last Login"
        />
      ),
      render: (rowData: any) => {
        const { lastLoginTime } = rowData;
        return lastLoginTime > 0 ? (
          <TextRender
            data={
              <DateAndTimeConverter epoch={lastLoginTime} monthFormat="long" />
            }
          />
        ) : null;
      },
    },
    {
      width: "8%",
      header: <FormattedMessage id="locked" defaultMessage="Locked" />,
      render: (rowData: any) => {
        const { id, state } = rowData;
        return (
          <Toggle
            className="TableCellToggle"
            id={`user-locked-toggle-${id}`}
            checked={rowData.state === "locked"}
            func={() =>
              toggleStatus(id, state, (newState: string) => {
                rowData.state = newState;
              })
            }
            disabled={!canLockUser}
          />
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="users.button.editUser"
          description="empty table header"
          defaultMessage=" "
        />
      ),
      render: (rowData: any) => (
        <DrawerComp
          id={`users-edit-${rowData.userName}-button`}
          label={intl.formatMessage({
            id: "edit",
            defaultMessage: "Edit",
          })}
          overrideWidth
          disableHorizontalScroll
          widthPercentage={20}
        >
          <UserDrawer user={rowData} edit />
        </DrawerComp>
      ),
    },
  ];

  useEffect(() => {
    getUserInfos();
  }, [userSearchDto]);

  useEffect(() => {
    emitter.on(UsersEvent.PartnerUserChanged, () => getUserInfos());
  }, []);

  return (
    <div>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "users",
            defaultMessage: "Users",
          })}`}
        </title>
      </Helmet>
      <Box>
        <Grid
          container
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Grid item></Grid>
          <Grid item sx={{ lineHeight: 1 }}>
            <Box>
              <DrawerComp
                id="user-add-new-user-drawer"
                label={intl.formatMessage(
                  defineMessage({
                    id: "addNewUser",
                    description: "Add new user information",
                    defaultMessage: "Add New User",
                  })
                )}
                widthPercentage={20}
                textCase="upper"
              >
                <UserDrawer />
              </DrawerComp>
            </Box>
          </Grid>
        </Grid>
        <Box>
          <StandardTable
            id="users-table"
            tableRowPrefix="usersTable"
            tableMetadata={userInfoMetadata}
            dataList={userInfoList}
            setDto={setUserSearchDto}
            dto={userSearchDto}
            offsetPaginationElements={offsetPaginationElements}
            setOffsetPaginationElements={setOffsetPaginationElements}
            tableTitle={intl.formatMessage({
              id: "users",
              defaultMessage: "Users",
            })}
          />
        </Box>
      </Box>
    </div>
  );
};
export default Users;
