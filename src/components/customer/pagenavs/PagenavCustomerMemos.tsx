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

import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import api from "../../../api/api";
import StandardTable from "../../common/table/StandardTable";
import DrawerComp from "../../common/DrawerComp";
import MemoDrawer from "../drawers/MemoDrawer";
import emitter from "../../../emitter";
import DateAndTimeConverter from "../../common/converters/DateAndTimeConverter";
import { MessageContext } from "../../../contexts/MessageContext";
import TextRender from "../../common/TextRender";
import Header from "../../common/elements/Header";
import {ContentVisibilityContext} from "../../../contexts/ContentVisibilityContext";

interface IPageNavCustomerMemos {
  customerNumber: string;
}

interface IEmail {
  emailType: string;
  emailAddress: string;
}

interface IPhone {
  phoneNumber: string;
  phoneType: string;
}

interface IResolveLabel {
  contactMethod: string;
  contactInfo: string;
}

const PageNavCustomerMemos: React.FC<IPageNavCustomerMemos> = (props) => {
  const { customerNumber } = props;
  const intl = useIntl();
  const [memos, setMemos] = useState([]);
  const [phones, setPhones] = useState<IPhone[]>([
    {
      phoneNumber: "",
      phoneType: "",
    },
  ]);
  const [emails, setEmails] = useState<IEmail[]>([
    {
      emailAddress: "",
      emailType: "",
    },
  ]);
  let pillColor = "info";

  const { setErrorMsg } = useContext(MessageContext);
  const { readOnly } = useContext(ContentVisibilityContext);

  const findContactAttr = (attrs: any) =>
    attrs.find(
      (i: any) => i.name === "contactPhone" || i.name === "contactEmail"
    );
  const parseContactMethod = (attr: any) =>
    attr ? attr.name.replace("contact", "") : "";
  const getContactInfo = (attr: any) => (attr ? attr.value : "");

  const formatData = (providedMemos: any) => {
    if (providedMemos.length > 0) {
      const list = providedMemos.map((memo: any) => ({
        memoId: memo.id,
        memo: memo.memo,
        creationTime: memo.creationTime,
        createdBy: memo.createdBy.firstName,
        externalReference: memo.externalReference,
        contactMethod: parseContactMethod(findContactAttr(memo.attributes)),
        contactInfo: getContactInfo(findContactAttr(memo.attributes)),
      }));
      setMemos(list);
    }
  };

  const getCustomerMemos = () => {
    const options = {
      count: 100,
      startIndex: 0,
      ascending: false,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerMemoAPI.getCustomerMemos(customerNumber, options)
      .then((memoList: any) => {
        formatData(memoList.data);
      })
      .catch((error: any) => {
        setErrorMsg(error);
      });
  };

  const getCustomerPhones = (personIdentifier: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.getPhones(personIdentifier)
      .then((phonesList: any) => {
        const phoneArray: IPhone[] = [];
        phonesList.forEach((p: any) => {
          phoneArray.push({
            phoneType: p.type,
            phoneNumber: `+${p.countryCode}${p.phoneNumber}`,
          });
        });
        setPhones(phoneArray);
      })
      .catch((error: any) => {
        setErrorMsg(error);
      });

  const getCustomer = async (customerIdentifier: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cust = await api.CustomerAPI.get(customerIdentifier).catch(
      (error: any) => setErrorMsg(error)
    );
    return cust;
  };

  const getCustomerEmails = (personIdentifier: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.getEmailList(personIdentifier)
      .then((emailList: any) => {
        const emailArray: IEmail[] = [];
        emailList.forEach((e: any) => {
          emailArray.push({
            emailType: e.type,
            emailAddress: e.email,
          });
        });
        setEmails(emailArray);
      })
      .catch((error: any) => setErrorMsg(error));

  const setPillColor = (color: string) => {
    pillColor = color;
  };

  const resolveLabel = ({ contactMethod, contactInfo }: IResolveLabel) => {
    let result = "";
    if (contactMethod === "Phone") {
      phones.forEach((p) => {
        if (contactInfo.replace(" ", "").includes(p.phoneNumber)) {
          result = p.phoneType.toString();
          setPillColor("error");
        }
      });
    } else if (contactMethod === "Email") {
      emails.forEach((e) => {
        if (contactInfo.includes(e.emailAddress)) {
          result = e.emailType;
          setPillColor("warning");
        }
      });
    }
    return result;
  };

  useEffect(() => {
    getCustomerMemos();
    emitter.on("customer.memo.changed", () => {
      getCustomerMemos();
    });
    getCustomer(customerNumber).then((cust) => {
      const { id } = cust.primaryPerson;
      getCustomerEmails(id);
      getCustomerPhones(id);
    });
  }, []);

  const tableMetadata = [
    {
      width: "16%",
      header: (
        <FormattedMessage
          id="dateCreated"
          description="Date and time of memo creation"
          defaultMessage="Date Created"
        />
      ),
      render: (rowData: any) => {
        const { creationTime } = rowData;
        const { creationTime: creationTime1 } = rowData;
        return creationTime !== 0 ? (
          <DateAndTimeConverter epoch={creationTime1} monthFormat="long" />
        ) : null;
      },
    },
    {
      width: "16%",
      header: (
        <FormattedMessage
          id="createdBy"
          description="Name of memo creator"
          defaultMessage="Created By"
        />
      ),
      render: (rowData: any) => {
        const { createdBy } = rowData;
        return <TextRender data={createdBy} />;
      },
    },
    {
      width: "16%",
      header: (
        <FormattedMessage
          id="memo"
          description="Memo created"
          defaultMessage="Memo"
        />
      ),
      render: (rowData: any) => {
        const { memo } = rowData;
        const { memoId } = rowData;

        return (
          <div>
            <DrawerComp id="edit-memo-link" label={memo} asLink>
              <MemoDrawer
                memoId={memoId}
                customerNumber={customerNumber}
                isEditMemo
              />
            </DrawerComp>
          </div>
        );
      },
    },
    {
      width: "16%",
      header: (
        <FormattedMessage
          id="contactMethod"
          description="Contact Method provided"
          defaultMessage="Contact Method"
        />
      ),
      render: (rowData: any) => {
        const { contactMethod } = rowData;
        return <TextRender data={contactMethod} />;
      },
    },
    {
      width: "16%",
      header: (
        <FormattedMessage
          id="contactInfo"
          description="Contact info provided"
          defaultMessage="Contact Info"
        />
      ),
      render: (rowData: any) => {
        const { contactInfo } = rowData;
        return <Box>{contactInfo}</Box>;
      },
    },
    {
      width: "16%",
      header: (
        <FormattedMessage
          id="externalReference"
          description="External Reference ID provided"
          defaultMessage="External Reference"
        />
      ),
      render: (rowData: any) =>
        rowData.externalReference !== undefined ? (
          <TextRender data={rowData.externalReference} />
        ) : (
          ""
        ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "18px",
        }}
      >
        <Header
          value={intl.formatMessage(
            defineMessage({
              id: "customerMemos",
              description: "Memo section header",
              defaultMessage: "Customer Memos",
            })
          )}
          level={2}
          bold
          color="primary"
        />
        <Box>
          <DrawerComp
            id="add-memo-button"
            label={intl.formatMessage({
              id: "memo.button.addNewMemo",
              defaultMessage: "ADD NEW MEMO",
            })}
            disabled={readOnly}
          >
            <MemoDrawer customerNumber={customerNumber} />
          </DrawerComp>
        </Box>
      </Box>
      <Box>
        <StandardTable
          id="customer-detail-memos-table"
          dataList={memos}
          tableMetadata={tableMetadata}
          tableRowPrefix="memo-row"
        />
      </Box>
    </Box>
  );
};

export default PageNavCustomerMemos;
