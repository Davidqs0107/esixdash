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
import React, { ReactNode } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

interface IBreadcrumbsNav {
  links?: {
    name: string;
    path: string;
  }[];
  className?: string;
  children?: ReactNode;
}

const StyledBreadcrumb = styled(Breadcrumbs)({
  "&.withBorder": {
    paddingBottom: "20px",
    borderBottom: "1px solid #EEEEEE",
    marginBottom: "34px",
  },
  ".MuiBreadcrumbs-li > .MuiLink-root": {
    fontSize: "10px",
    fontWeight: "bold",
  },
  ".MuiBreadcrumbs-li > .MuiTypography-grey": {
    color: "#8995AD",
    fontWeight: 500,
  },
  "&.withButton .MuiBreadcrumbs-li:last-child": {
    flexGrow: 1,
    textAlign: "right",
  },
  ".MuiBreadcrumbs-separator": {
    color: "#8995AD",
  },
  ".MuiTypography-root": {
    fontSize: "10px",
  },
});

const BreadcrumbsNav: React.FC<IBreadcrumbsNav> = ({
  links,
  className,
  children,
}) => {
  const location = useLocation();

  const getCurrentRoute = () => {
    return location.pathname;
  };

  return (
    <StyledBreadcrumb aria-label="breadcrumb" className={className}>
      {links &&
        links.map((link, level) => (
          <Link
            key={`breadcrumb${level}`}
            href={link.path}
            underline="none"
            variant={
              getCurrentRoute() === link.path && level === 0 ? "grey" : "link"
            }
          >
            {link.name}
          </Link>
        ))}
      {children}
    </StyledBreadcrumb>
  );
};

export default BreadcrumbsNav;
